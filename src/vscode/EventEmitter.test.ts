import { describe, expect, jest, test } from '@jest/globals';

import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
    test('fire', () => {
        const emitter = new EventEmitter<string>();
        const listener = jest.fn();
        const listener2 = jest.fn();
        emitter.event(listener);
        emitter.event(listener2);
        emitter.fire('foo');
        expect(listener).toHaveBeenCalledWith('foo');
        expect(listener2).toHaveBeenCalledWith('foo');
    });

    test('dispose', () => {
        const emitter = new EventEmitter<string>();
        const listener = jest.fn();
        const disposable = emitter.event(listener);
        emitter.fire('foo');
        disposable.dispose();
        emitter.fire('bar');
        expect(listener).toHaveBeenCalledWith('foo');
    });
});
