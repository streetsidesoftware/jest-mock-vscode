/* eslint-disable @typescript-eslint/class-literal-property-style */
import type * as vscode from 'vscode';

import type { TestFramework } from '../TestFramework';
import { createTextDocument, readTextDocument } from '../vscodeTypesHelper';
import { eventStub } from './event';
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
        onDidSaveTextDocument = eventStub<vscode.TextDocument>(jest);
        openTextDocument = openTextDocument;
        openNotebookDocument = jest.fn();
        onDidChangeConfiguration = eventStub<vscode.ConfigurationChangeEvent>(jest);
        onDidChangeNotebookDocument = eventStub<vscode.NotebookDocumentChangeEvent>(jest);
        onDidChangeTextDocument = eventStub<vscode.TextDocumentChangeEvent>(jest);
        onDidChangeWorkspaceFolders = eventStub<vscode.WorkspaceFoldersChangeEvent>(jest);
        onDidCloseNotebookDocument = eventStub<vscode.NotebookDocument>(jest);
        onDidCloseTextDocument = eventStub<vscode.TextDocument>(jest);
        onDidCreateFiles = eventStub<vscode.FileCreateEvent>(jest);
        onDidDeleteFiles = eventStub<vscode.FileDeleteEvent>(jest);
        onDidGrantWorkspaceTrust = eventStub<undefined>(jest);
        onDidOpenNotebookDocument = eventStub<vscode.NotebookDocument>(jest);
        onDidOpenTextDocument = eventStub<vscode.TextDocument>(jest);
        onDidRenameFiles = eventStub<vscode.FileRenameEvent>(jest);
        onDidSaveNotebookDocument = eventStub<vscode.NotebookDocument>(jest);
        onWillCreateFiles = eventStub<vscode.FileWillCreateEvent>(jest);
        onWillDeleteFiles = eventStub<vscode.FileWillDeleteEvent>(jest);
        onWillRenameFiles = eventStub<vscode.FileWillRenameEvent>(jest);
        onWillSaveNotebookDocument = eventStub<vscode.NotebookDocumentWillSaveEvent>(jest);
        onWillSaveTextDocument = eventStub<vscode.TextDocumentWillSaveEvent>(jest);
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
