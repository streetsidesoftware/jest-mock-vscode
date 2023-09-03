// eslint-disable-next-line node/no-missing-import
import type { TabGroups, TabGroup } from 'vscode';
import { TestFramework } from '../TestFramework';

export class MockTabGroups implements TabGroups {
    constructor(
        private jest: TestFramework,
        readonly all: TabGroup[],
    ) {}

    get activeTabGroup(): TabGroup {
        return this.all[0];
    }

    onDidChangeTabGroups = this.jest.fn();
    onDidChangeTabs = this.jest.fn();
    close = this.jest.fn();
}
