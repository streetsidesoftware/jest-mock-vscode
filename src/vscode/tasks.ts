import type * as vscode from 'vscode';

import type { TestFramework } from '../TestFramework';
import { eventStub } from './event';

type Tasks = typeof vscode.tasks;

export function createTasks(jest: TestFramework): Tasks {
    const tasks: Tasks = {
        registerTaskProvider: jest.fn(),
        fetchTasks: jest.fn(),
        executeTask: jest.fn(),
        taskExecutions: [],
        onDidStartTask: eventStub(jest),
        onDidEndTask: eventStub(jest),
        onDidStartTaskProcess: eventStub(jest),
        onDidEndTaskProcess: eventStub(jest),
    };
    return tasks;
}
