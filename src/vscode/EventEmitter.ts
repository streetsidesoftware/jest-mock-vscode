// eslint-disable-next-line node/no-missing-import
import type * as vscode from 'vscode';
import type { Disposable } from 'vscode';

type Listener<T> = (e: T) => any;

export class EventEmitter<T> implements vscode.EventEmitter<T> {
    readonly #listeners = new Set<Listener<T>>();

    /**
     * The event listeners can subscribe to.
     */
    event(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable {
        const fn = thisArgs ? listener.bind(thisArgs) : listener;
        this.#listeners.add(fn);
        const disposable = {
            dispose: () => {
                this.#listeners.delete(fn);
            },
        };

        if (disposables) {
            disposables.push(disposable);
        }

        return disposable;
    }

    /**
     * Notify all subscribers of the {@link EventEmitter.event event}. Failure
     * of one or more listener will not fail this function call.
     *
     * @param data The event object.
     */
    fire(data: T): void {
        for (const listener of this.#listeners) {
            try {
                listener(data);
            } catch {
                // ignore
            }
        }
    }

    /**
     * Dispose this object and free resources.
     */
    dispose(): void {
        this.#listeners.clear();
    }

    constructor() {}
}
