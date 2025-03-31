import rootESLint from '../../eslint.config.mjs';

export default [
    ...rootESLint,
    {
        languageOptions: {
            parserOptions: {
                // NOTE: Loading tsconfig.json references does not work, so
                // loading explicitly here
                project: ['./tsconfig.lib.json', 'tsconfig.umd.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-fallthrough': 'error',
            'no-case-declarations': 'error',
            'no-prototype-builtins': 'error',
            'no-unexpected-multiline': 'error',
            'no-useless-escape': 'error',
            'prefer-spread': 'error',
            'no-irregular-whitespace': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
            'prefer-rest-params': 'error',
            '@typescript-eslint/ban-types': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/prefer-as-const': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
            '@typescript-eslint/no-unnecessary-type-constraint': 'error',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-for-in-array': 'error',
            'no-restricted-properties': [
                'warn',
                { property: 'innerText', message: 'Prefer textContent where possible.' },
                { property: 'innerHTML', message: 'Prefer textContent where possible.' },
                {
                    object: 'Object',
                    property: 'entries',
                    message: 'Prefer Object.keys() to Object.entries() for performance reasons.',
                },
            ],
            'no-restricted-syntax': [
                'error',
                'ForInStatement',
                {
                    selector: 'Literal[value=/^&(w*);$/i]',
                    message:
                        "Prefer unicode characters as they don't have to be parsed into HTML to display correctly.",
                },
                {
                    selector: 'ImportDeclaration[specifiers.length = 0][source.value=ag-grid-community]',
                    message:
                        'Empty imports are not allowed. i.e import "ag-grid-community"; as it will cause warnings about being sideEffect free',
                },
            ],
            'no-restricted-imports': [
                'error',
                {
                    name: 'ag-charts-community',
                    message: 'There should be no direct imports of ag-charts-community',
                },
                {
                    name: 'ag-charts-core',
                    message: 'There should be no direct imports of ag-charts-core',
                },
                {
                    name: 'ag-charts-enterprise',
                    message: 'There should be no direct imports of ag-charts-enterprise',
                },
                {
                    name: 'ag-grid-enterprise',
                    message: 'There should be no imports of ag-grid-enterprise, use relative imports instead',
                },
            ],

            'no-console': 'error',
        },
    },
    {
        ignores: ['webpack.config.js', 'jest.*.js', 'eslint.config.mjs', 'jest.jsdom-env.cjs', 'test-utils/mock.ts'],
    },
];
