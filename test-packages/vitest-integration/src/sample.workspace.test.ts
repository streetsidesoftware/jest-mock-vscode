import { afterEach, describe, expect, test, vi } from 'vitest';
import { createVSCodeMock } from 'jest-mock-vscode';
import { Uri, workspace, WorkspaceFolder } from 'vscode';

vi.mock('vscode', () => createVSCodeMock(vi));

const rootUri = Uri.file(__dirname);
const workspaceFolder1: WorkspaceFolder = {
    uri: Uri.joinPath(rootUri, 'Folder1'),
    name: 'Folder1',
    index: 0,
};

const workspaceFolder2: WorkspaceFolder = {
    uri: Uri.joinPath(rootUri, 'Folder2'),
    name: 'Folder2',
    index: 1,
};

describe('workspace', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('getWorkspaceFolder', () => {
        const uri = Uri.joinPath(workspaceFolder1.uri, 'code.test.ts');
        const uri2 = Uri.joinPath(workspaceFolder2.uri, 'test.txt');

        const spy = vi.spyOn(workspace, 'workspaceFolders', 'get');
        spy.mockReturnValue([workspaceFolder1, workspaceFolder2]);

        expect(workspace.workspaceFolders).toEqual([workspaceFolder1, workspaceFolder2]);
        expect(workspace.getWorkspaceFolder(uri)).toEqual(workspaceFolder1);
        expect(workspace.getWorkspaceFolder(uri2)).toEqual(workspaceFolder2);
    });
});
