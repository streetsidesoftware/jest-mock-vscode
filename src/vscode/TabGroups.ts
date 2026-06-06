import type { TabChangeEvent, TabGroup, TabGroupChangeEvent, TabGroups } from 'vscode';

import type { TestFramework } from '../TestFramework';
import { eventStub } from './event';

export function createMockTabGroups(jest: TestFramework, all: TabGroup[]) {
    class MockTabGroups implements TabGroups {
        constructor(readonly all: TabGroup[]) {}

        get activeTabGroup(): TabGroup {
            return this.all[0];
        }

        onDidChangeTabGroups = eventStub<TabGroupChangeEvent>(jest);
        onDidChangeTabs = eventStub<TabChangeEvent>(jest);
        close = jest.fn();
    }

    return new MockTabGroups(all);
}

export type MockTabGroups = ReturnType<typeof createMockTabGroups>;
