import { describe, expect, jest, test } from '@jest/globals';
import * as fs from 'fs/promises';

import { Uri } from './uri';
import { createWindow } from './window';
import { createWorkspace } from './workspace';

/**
 * EXPLICIT any
 */
type ANY = any;

const workspace = createWorkspace(jest);
const window = createWindow(jest, workspace);

describe('window', () => {
    test('window', () => {
        expect(typeof window.showErrorMessage).toBe('function');
    });

    test('showTextDocument uri', async () => {
        const uri = Uri.file(__filename);
        const editor = await window.showTextDocument(uri);
        expect(editor.document.uri).toEqual(uri);
        const content = await fs.readFile(uri.fsPath, 'utf-8');
        expect(editor.document.getText()).toBe(content);
    });

    test('showTextDocument textDocument', async () => {
        const content = await fs.readFile(__filename, 'utf-8');
        const editor = await window.showTextDocument(
            await workspace.openTextDocument({ content, language: 'typescript' }),
        );
        expect(editor.document.uri.toString()).toEqual('untitled:Untitled-1');
        expect(editor.document.getText()).toBe(content);
    });

    test('createStatusBarItem', () => {
        const sb = window.createStatusBarItem();
        expect(sb.text).toBe('');
        const sb2 = window.createStatusBarItem('id-ext');
        expect(sb2.id).toBe('id-ext');
    });

    test.each`
        method
        ${'showErrorMessage'}
        ${'showInformationMessage'}
        ${'showInputBox'}
        ${'showOpenDialog'}
        ${'showQuickPick'}
        ${'showSaveDialog'}
        ${'showWarningMessage'}
        ${'showWorkspaceFolderPick'}
    `('partial mocks method resolve to undefined $method', async ({ method }) => {
        const fn = (window as Record<string, ANY>)[method as string];
        await expect(fn()).resolves.toEqual(undefined);
    });
});
