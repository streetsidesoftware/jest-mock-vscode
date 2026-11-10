import { describe, expect, test } from '@jest/globals';

import { TimelineItem, TimelineTriggerKind } from './TimelineItem';
import { Uri } from './uri';

describe('TimelineItem', () => {
    test('create from a label', () => {
        const item = new TimelineItem('commit', 1000);

        expect(item).toBeInstanceOf(TimelineItem);
        expect(item.label).toBe('commit');
        expect(item.resourceUri).toBeUndefined();
        expect(item.timestamp).toBe(1000);
    });

    test('create from a resource uri', () => {
        const uri = Uri.file(__filename);
        const item = new TimelineItem(uri, 2000);

        expect(item.label).toBeUndefined();
        expect(item.resourceUri).toBe(uri);
        expect(item.timestamp).toBe(2000);
    });

    test('TimelineTriggerKind', () => {
        expect(TimelineTriggerKind.Invoke).toBe(1);
        expect(TimelineTriggerKind.Automatic).toBe(2);
    });
});
