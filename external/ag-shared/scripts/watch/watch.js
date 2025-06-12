/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Watch nx dev environments in a queue
 *
 * Use `nx` to watch projects, batch up the changes, and update `BUILD_QUEUE_EMPTY_FILE`
 * once the changes settle down. This ensures multiple updates triggered in parallel get
 * batched up into one update event. Watching `BUILD_QUEUE_EMPTY_FILE` in another process
 * can be used to trigger further updates eg, website refresh.
 *
 * Usage: node ./watch [charts|grid]
 */
const { spawn, spawnSync } = require('child_process');
const fsp = require('node:fs/promises');
const fs = require('node:fs');
const path = require('path');
const { QUIET_PERIOD_MS, BATCH_LIMIT, PROJECT_ECHO_LIMIT, NX_ARGS, BUILD_QUEUE_EMPTY_FILE } = require('./constants');
const chartsConfig = require('./chartsWatch.config');
const gridConfig = require('./gridWatch.config');

const RED = '\x1b[;31m';
const GREEN = '\x1b[;32m';
const YELLOW = '\x1b[;33m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[m';

function info(msg, ...args) {
    console.log(`*** ${GRAY}${msg}${RESET}`, ...args);
}
function success(msg, ...args) {
    console.log(`*** ${GREEN}${msg}${RESET}`, ...args);
}
function warning(msg, ...args) {
    console.log(`*** ${YELLOW}${msg}${RESET}`, ...args);
}
function error(msg, ...args) {
    console.log(`*** ${RED}${msg}${RESET}`, ...args);
}

function formatTime(timeDifference) {
    if (timeDifference < 1000) {
        return `${timeDifference.toFixed(2)}ms`;
    } else if (timeDifference < 60000) {
        return `${(timeDifference / 1000).toFixed(2)}s`;
    } else {
        const minutes = Math.floor(timeDifference / 60000);
        const seconds = ((timeDifference % 60000) / 1000).toFixed(2);
        return `${minutes}min ${seconds}s`;
    }
}

function createTimeManager() {
    const startTimes = {};
    const completeTimeEntries = [];

    function getTimeString(label, time) {
        return `${label}: ${formatTime(time)}`;
    }

    return {
        start(label) {
            if (startTimes[label]) {
                warning(`Time '${label}' already started`);
                return;
            }
            startTimes[label] = performance.now();
        },
        stop(label) {
            const time = startTimes[label];
            if (time) {
                completeTimeEntries.push([label, performance.now() - time]);
                delete startTimes[label];
            } else {
                warning(`Time '${label}' not started`);
            }
        },
        hasStarted(label) {
            return Boolean(startTimes[label]);
        },
        clear() {
            Object.keys(startTimes).forEach((key) => delete startTimes[key]);
            completeTimeEntries.length = 0;
        },
        getCompleteTimeEntries() {
            return [...completeTimeEntries];
        },
        timeString(labelToFind) {
            const entry = completeTimeEntries.findLast(([label]) => label === labelToFind);

            if (!entry) {
                warning(`'${labelToFind}' not found`);
                return;
            }

            const [label, time] = entry;
            return getTimeString(label, time);
        },
        toString() {
            return completeTimeEntries
                .map(([label, time]) => {
                    return getTimeString(label, time);
                })
                .join('\n');
        },
    };
}

const spawnedChildren = new Set();
const timeManager = createTimeManager();

function spawnNxWatch(outputCb) {
    let exitResolve, exitReject;
    const exitPromise = new Promise((resolve, reject) => {
        exitResolve = resolve;
        exitReject = reject;
    });

    const nxWatch = spawn('nx', [...NX_ARGS, ...'watch --all -- echo ${NX_PROJECT_NAME}'.split(' ')], {
        env: process.env,
    });
    spawnedChildren.add(nxWatch);
    nxWatch.on('error', (e) => {
        console.error(e);
        exitReject(e);
    });
    nxWatch.on('exit', () => {
        spawnedChildren.delete(nxWatch);
        exitResolve();
    });
    nxWatch.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const project of lines) {
            if (project.trim().length === 0) continue;

            outputCb(project);
        }
    });

    return exitPromise;
}

function spawnNxRun(target, config, projects) {
    let exitResolve, exitReject;
    const exitPromise = new Promise((resolve, reject) => {
        exitResolve = resolve;
        exitReject = reject;
    });

    const nxRunArgs = [...NX_ARGS, 'run-many', '-t', target];
    if (config != null) {
        nxRunArgs.push('-c', config);
    }
    nxRunArgs.push('-p', ...projects);

    success(`Executing: nx ${nxRunArgs.join(' ')}`);
    const nxRun = spawn(`nx`, nxRunArgs, { stdio: 'inherit', env: process.env });
    spawnedChildren.add(nxRun);
    nxRun.on('error', (e) => {
        console.error(e);
        exitReject(e);
    });
    nxRun.on('exit', (code) => {
        spawnedChildren.delete(nxRun);
        if (code === 0) {
            exitResolve();
        } else {
            exitReject();
        }
    });

    return exitPromise;
}

let timeout;
function scheduleBuild(dueMs = QUIET_PERIOD_MS) {
    if (buildBuffer.length > 0) {
        if (!timeManager.hasStarted('Total build time')) {
            timeManager.start('Total build time');
        }

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => build(), dueMs);
    }
}

let gitDir;
function getGitDir() {
    if (!gitDir) {
        const result = spawnSync(`git rev-parse --git-dir`);
        if (result.status !== 0) {
            return '.git';
        }
        gitDir = result.stdout.toString().trim();
    }
    return gitDir;
}

function isBuildBlocked() {
    return (
        fs.existsSync(path.join(getGitDir(), 'index.lock')) ||
        fs.existsSync(path.join(getGitDir(), 'rebase-merge')) ||
        fs.existsSync(path.join(getGitDir(), 'rebase-apply')) ||
        fs.existsSync(path.join(getGitDir(), 'MERGE_MSG'))
    );
}

let buildBuffer = [];
function processWatchOutput({ project: rawProject, getProjectBuildTargets }) {
    if (rawProject === '') return;

    for (const [project, targets, config] of getProjectBuildTargets(rawProject)) {
        for (const target of targets) {
            buildBuffer.push([project, config, target]);
        }
    }

    scheduleBuild();
}

function countReloadTargets() {
    const reloadableTargets = new Set(config.devServerReloadTargets);

    let count = 0;
    for (const [, , target] of buildBuffer) {
        if (reloadableTargets.has(target)) {
            count++;
        }
    }

    return count;
}

let buildRunning = false;
async function build() {
    if (buildRunning) return;

    if (isBuildBlocked()) {
        warning('Git operation in progress, build paused; will retry in 10 seconds.');
        scheduleBuild(10_000);
        return;
    }

    buildRunning = true;

    const beforeReloadableCount = countReloadTargets();
    const [, config, target] = buildBuffer.at(0);
    const newBuildBuffer = [];
    const projects = new Set();
    for (const next of buildBuffer) {
        if (projects.size < BATCH_LIMIT && next[2] === target && next[1] === config) {
            projects.add(next[0]);
        } else {
            newBuildBuffer.push(next);
        }
    }
    buildBuffer = newBuildBuffer;
    const afterReloadableCount = countReloadTargets();

    let targetMsg = [...projects.values()].slice(0, PROJECT_ECHO_LIMIT).join(' ');
    if (projects.size > PROJECT_ECHO_LIMIT) {
        targetMsg += ` (+${projects.size - PROJECT_ECHO_LIMIT} targets)`;
    }
    try {
        timeManager.start(`${targetMsg} build`);
        success(`Starting build for: ${targetMsg}`);
        await spawnNxRun(target, config, [...projects.values()]);
        success(`Completed build for: ${targetMsg}`);
        success(`Build queue has ${buildBuffer.length} remaining.`);
        timeManager.stop(`${targetMsg} build`);
        info(timeManager.timeString(`${targetMsg} build`));

        if (beforeReloadableCount > 0 && afterReloadableCount === 0) {
            success(`Reloading dev server...`);
            await touchBuildQueueEmptyFile();
        }

        if (buildBuffer.length === 0) {
            timeManager.stop('Total build time');
            info('Last build buffer times...');
            timeManager
                .toString()
                .split('\n')
                .forEach((str) => info(str));
            timeManager.clear();
        }
    } catch (e) {
        error(`Build failed for: ${targetMsg}: ${e}`);
    } finally {
        buildRunning = false;
        scheduleBuild();
    }
}

async function touchBuildQueueEmptyFile() {
    try {
        const time = new Date();
        await fsp.utimes(BUILD_QUEUE_EMPTY_FILE, time, time);
    } catch (err) {
        if ('ENOENT' !== err.code) {
            throw err;
        }

        const dirPath = path.dirname(BUILD_QUEUE_EMPTY_FILE);
        await fsp.mkdir(dirPath, { recursive: true });
        const fh = await fsp.open(BUILD_QUEUE_EMPTY_FILE, 'a');
        await fh.close();
    }
}

const CONSECUTIVE_RESPAWN_THRESHOLD_MS = 500;
async function run(config) {
    const { ignoredProjects, getProjectBuildTargets } = config;

    for (const { file, projects } of config.externalBuildTriggers ?? []) {
        if (!fs.existsSync(file)) continue;

        info(`Watching [${file}] for changes, affecting [${projects.join(' ')}]`);
        fs.watch(file, () => {
            for (const project of projects) {
                processWatchOutput({ project, getProjectBuildTargets });
            }
        });
    }

    let lastRespawn;
    let consecutiveRespawns = 0;
    while (true) {
        lastRespawn = Date.now();
        success('Starting watch...');
        await spawnNxWatch((project) => {
            if (ignoredProjects.includes(project)) return;

            processWatchOutput({ project, getProjectBuildTargets });
        });

        if (Date.now() - lastRespawn < CONSECUTIVE_RESPAWN_THRESHOLD_MS) {
            consecutiveRespawns++;
        } else {
            consecutiveRespawns = 0;
        }

        if (consecutiveRespawns > 5) {
            respawnError();
            return;
        }

        await waitMs(1_000);
    }
}

function respawnError() {
    error(`Repeated respawn detected!
        
    The Nx Daemon maybe erroring, try restarting it to resolve with either:
    - \`nx daemon --stop\`
    - \`yarn\`

    Or alternatively view its logs at:
    - .nx/cache/d/daemon.log
`);
}

function waitMs(timeMs) {
    let resolveWait;
    setInterval(() => resolveWait(), timeMs);
    return new Promise((r) => (resolveWait = r));
}

process.on('beforeExit', () => {
    for (const child of spawnedChildren) {
        child.kill();
    }
    spawnedChildren.clear();
});

const library = process.argv[2];
if (!['charts', 'grid'].includes(library)) {
    const msg = 'Invalid library to watch. Options: charts, grid';
    error(msg);
    throw new Error(msg);
}
const config = library === 'charts' ? chartsConfig : gridConfig;
run(config);
