/* eslint-disable @typescript-eslint/class-literal-property-style */
import type * as vscode from 'vscode';

import type { TestFramework } from '../TestFramework';
import { createTextDocument, readTextDocument } from '../vscodeTypesHelper';
import { createMockFileSystem } from './fs';
import { isUri, Uri } from './uri';
import { createMockWorkspaceConfiguration } from './WorkspaceConfiguration';

export type Workspace = typeof vscode.workspace;

export function createWorkspace(jest: TestFramework) {
    const _fs = createMockFileSystem(jest);
    let _workspaceFolders: Workspace['workspaceFolders'] = undefined;

    class MockWorkspace implements Workspace {
        get workspaceFolders(): Workspace['workspaceFolders'] {
            return _workspaceFolders;
        }

        setWorkspaceFolders(folders: vscode.WorkspaceFolder[] | undefined): void {
            _workspaceFolders = folders;
        }

        get fs(): Workspace['fs'] {
            return _fs;
        }

        get name(): Workspace['name'] {
            return 'mock-workspace';
        }

        get workspaceFile(): Workspace['workspaceFile'] {
            return undefined;
        }

        rootPath = undefined;
        isTrusted = true;
        textDocuments = [];
        notebookDocuments = [];

        __mockConfig = createMockWorkspaceConfiguration(jest);

        applyEdit = jest.fn();
        asRelativePath = jest.fn((a) => a?.toString());
        createFileSystemWatcher = jest.fn();
        findFiles = jest.fn();
        getConfiguration = jest.fn((...args: Parameters<Workspace['getConfiguration']>) =>
            this.__mockConfig.__getConfiguration(...args),
        );
        getWorkspaceFolder = jest.fn((uri) => getWorkspaceFolder(uri, this.workspaceFolders || []));
        onDidSaveTextDocument = jest.fn();
        openTextDocument = openTextDocument;
        openNotebookDocument = jest.fn();
        onDidChangeConfiguration = jest.fn();
        onDidChangeNotebookDocument = jest.fn();
        onDidChangeTextDocument = jest.fn();
        onDidChangeWorkspaceFolders = jest.fn();
        onDidCloseNotebookDocument = jest.fn();
        onDidCloseTextDocument = jest.fn();
        onDidCreateFiles = jest.fn();
        onDidDeleteFiles = jest.fn();
        onDidGrantWorkspaceTrust = jest.fn();
        onDidOpenNotebookDocument = jest.fn();
        onDidOpenTextDocument = jest.fn();
        onDidRenameFiles = jest.fn();
        onDidSaveNotebookDocument = jest.fn();
        onWillCreateFiles = jest.fn();
        onWillDeleteFiles = jest.fn();
        onWillRenameFiles = jest.fn();
        onWillSaveNotebookDocument = jest.fn();
        onWillSaveTextDocument = jest.fn();
        registerFileSystemProvider = jest.fn();
        registerNotebookSerializer = jest.fn();
        registerTaskProvider = jest.fn();
        registerTextDocumentContentProvider = jest.fn();
        saveAll = jest.fn();
        save = jest.fn();
        saveAs = jest.fn();
        updateWorkspaceFolders = jest.fn();

        // vscode 1.100.0
        encode = jest.fn();
        decode = jest.fn();
    }

    const workspace = new MockWorkspace();
    return workspace;
}

export type MockWorkspace = ReturnType<typeof createWorkspace>;

interface OpenTextDocumentOptions {
    language?: string;
    content?: string;
}
function openTextDocument(uri: vscode.Uri | string): Thenable<vscode.TextDocument>;
function openTextDocument(options?: OpenTextDocumentOptions): Thenable<vscode.TextDocument>;
function openTextDocument(param?: string | vscode.Uri | OpenTextDocumentOptions): Promise<vscode.TextDocument> {
    const uri = typeof param === 'string' ? Uri.file(param) : isUri(param) ? param : undefined;
    const options = typeof param !== 'string' && !isUri(param) ? param : undefined;
    if (uri) {
        return readTextDocument(uri);
    }

    return Promise.resolve(
        createTextDocument(Uri.parse('untitled:Untitled-1'), options?.content || '', options?.language),
    );
}

function getWorkspaceFolder(
    uri: vscode.Uri,
    folders: readonly vscode.WorkspaceFolder[],
): vscode.WorkspaceFolder | undefined {
    const uriFolder = Uri.joinPath(uri, '..');

    return folders
        .filter((f) => uriFolder.path.startsWith(f.uri.path))
        .reduce((bestMatch: vscode.WorkspaceFolder | undefined, folder) => {
            if (!bestMatch) return folder;
            if (bestMatch.uri.path.length < folder.uri.path.length) return folder;
            return bestMatch;
        }, undefined);
}
