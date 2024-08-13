import { describe, expect, jest, test } from '@jest/globals';
import type { TabGroup } from 'vscode';

import { createMockTabGroups } from './TabGroups';

describe('TabGroups', () => {
    test('new MockTabGroups', () => {
        const tg: TabGroup = {
            isActive: true,
            viewColumn: 1,
            activeTab: undefined,
            tabs: [],
        };
        const mtg = createMockTabGroups(jest, [tg]);
        expect(mtg.activeTabGroup).toBe(tg);
    });
});
