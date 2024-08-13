import type * as vscode from 'vscode';

import type { TestFramework } from '../TestFramework';

type Tasks = typeof vscode.tasks;

export function createTasks(jest: TestFramework): Tasks {
    const tasks: Tasks = {
        registerTaskProvider: jest.fn(),
        fetchTasks: jest.fn(),
        executeTask: jest.fn(),
        taskExecutions: [],
        onDidStartTask: jest.fn(),
        onDidEndTask: jest.fn(),
        onDidStartTaskProcess: jest.fn(),
        onDidEndTaskProcess: jest.fn(),
    };
    return tasks;
}
