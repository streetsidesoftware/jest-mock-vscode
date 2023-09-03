// eslint-disable-next-line node/no-missing-import
import type * as vscode from 'vscode';
import { createMockFileSystem } from './fs';
import { createMockWorkspaceConfiguration } from './WorkspaceConfiguration';
import { createTextDocument, readTextDocument } from '../vscodeTypesHelper';
import { isUri, Uri } from './uri';
import { TestFramework } from '../TestFramework';

export type Workspace = typeof vscode.workspace;

export class MockWorkspace implements Workspace {
    constructor(private jest: TestFramework) {}
    private _fs = createMockFileSystem(this.jest);

    private _workspaceFolders: Workspace['workspaceFolders'] = undefined;

    get workspaceFolders(): Workspace['workspaceFolders'] {
        return this._workspaceFolders;
    }

    setWorkspaceFolders(folders: vscode.WorkspaceFolder[] | undefined): void {
        this._workspaceFolders = folders;
    }

    get fs(): Workspace['fs'] {
        return this._fs;
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

    __mockConfig = createMockWorkspaceConfiguration(this.jest);

    applyEdit = this.jest.fn();
    asRelativePath = this.jest.fn((a) => a?.toString());
    createFileSystemWatcher = this.jest.fn();
    findFiles = this.jest.fn();
    getConfiguration = this.jest.fn((...args: Parameters<Workspace['getConfiguration']>) =>
        this.__mockConfig.__getConfiguration(...args),
    );
    getWorkspaceFolder = this.jest.fn((uri) => getWorkspaceFolder(uri, this.workspaceFolders || []));
    onDidSaveTextDocument = this.jest.fn();
    openTextDocument = openTextDocument;
    openNotebookDocument = this.jest.fn();
    onDidChangeConfiguration = this.jest.fn();
    onDidChangeNotebookDocument = this.jest.fn();
    onDidChangeTextDocument = this.jest.fn();
    onDidChangeWorkspaceFolders = this.jest.fn();
    onDidCloseNotebookDocument = this.jest.fn();
    onDidCloseTextDocument = this.jest.fn();
    onDidCreateFiles = this.jest.fn();
    onDidDeleteFiles = this.jest.fn();
    onDidGrantWorkspaceTrust = this.jest.fn();
    onDidOpenNotebookDocument = this.jest.fn();
    onDidOpenTextDocument = this.jest.fn();
    onDidRenameFiles = this.jest.fn();
    onDidSaveNotebookDocument = this.jest.fn();
    onWillCreateFiles = this.jest.fn();
    onWillDeleteFiles = this.jest.fn();
    onWillRenameFiles = this.jest.fn();
    onWillSaveNotebookDocument = this.jest.fn();
    onWillSaveTextDocument = this.jest.fn();
    registerFileSystemProvider = this.jest.fn();
    registerNotebookSerializer = this.jest.fn();
    registerTaskProvider = this.jest.fn();
    registerTextDocumentContentProvider = this.jest.fn();
    saveAll = this.jest.fn();
    updateWorkspaceFolders = this.jest.fn();
}

export function createWorkspace(jest: TestFramework): MockWorkspace {
    const workspace = new MockWorkspace(jest);
    return workspace;
}

interface OpenTextDocumentOptions {
    language?: string;
    content?: string;
}
function openTextDocument(uri: vscode.Uri): Thenable<vscode.TextDocument>;
function openTextDocument(fileName: string): Thenable<vscode.TextDocument>;
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
