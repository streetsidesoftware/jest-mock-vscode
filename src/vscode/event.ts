import type * as vscode from 'vscode';

import type { TestFramework } from '../TestFramework';
import { EventEmitter } from './EventEmitter';

/**
 * A spy standing in for a `vscode.Event<T>`. Registering a listener returns a
 * real {@link vscode.Disposable}, matching the contract every VS Code event
 * honors. A bare `jest.fn()` returns `undefined`, which throws on the common
 * `disposables.push(onSomething(handler))` pattern at registration time.
 *
 * It stays a spy, so call introspection and per-test overrides still work; it
 * only gains a contract-honoring default return.
 */
export function eventStub<T>(jest: TestFramework): vscode.Event<T> {
    return jest.fn(new EventEmitter<T>().event);
}
