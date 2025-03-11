import type { IconName } from '@ag-website-shared/icon/Icon';
import type { CollectionEntry } from 'astro:content';

export type Framework = 'javascript' | 'react' | 'angular' | 'vue';

export type InternalFramework = 'vanilla' | 'typescript' | 'reactFunctional' | 'reactFunctionalTs' | 'angular' | 'vue3';

export type Library = 'charts' | 'grid';

export interface MenuSection {
    title?: string;
    excludeFromFeatures?: boolean;
    items?: MenuItem[];

    type?: 'whats-new';
    path?: string;
}

export interface MenuItem {
    title: string;
    path?: string;
    url?: string;
    newWindow?: boolean;
    icon?: IconName;
    frameworks?: Framework[];
    isEnterprise?: boolean;
    items?: MenuItem[];
    childPaths?: string[];
}

export interface FooterItem {
    title: string;
    links: {
        name: string;
        url: string;
        newTab?: boolean;
        iconName: string;
    }[];
}

export type ModuleMappings = CollectionEntry<'moduleMappings'>;

export interface VersionData {
    version: string;
    date: string;
    landingPageHightlight?: string;
    highlights?: { text: string; path?: string }[];
    notesPath?: string;
    hideBlogPostLink?: boolean;
    noDocs?: boolean;
}
