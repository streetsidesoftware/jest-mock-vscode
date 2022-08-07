// eslint-disable-next-line node/no-missing-import
import type { TabGroups, TabGroup } from 'vscode';

export class MockTabGroups implements TabGroups {
    constructor(readonly all: TabGroup[]) {}

    get activeTabGroup(): TabGroup {
        return this.all[0];
    }

    onDidChangeTabGroups = jest.fn();
    onDidChangeTabs = jest.fn();
    close = jest.fn();
}
