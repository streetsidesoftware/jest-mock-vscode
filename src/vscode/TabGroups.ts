import type { TabGroup, TabGroups } from 'vscode';

import type { TestFramework } from '../TestFramework';

export function createMockTabGroups(jest: TestFramework, all: TabGroup[]) {
    class MockTabGroups implements TabGroups {
        constructor(readonly all: TabGroup[]) {}

        get activeTabGroup(): TabGroup {
            return this.all[0];
        }

        onDidChangeTabGroups = jest.fn();
        onDidChangeTabs = jest.fn();
        close = jest.fn();
    }

    return new MockTabGroups(all);
}

export type MockTabGroups = ReturnType<typeof createMockTabGroups>;
