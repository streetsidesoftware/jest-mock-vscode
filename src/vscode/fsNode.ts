import { promises as fs } from 'fs';
// eslint-disable-next-line node/no-missing-import
import type * as vscode from 'vscode';
import { toFileSystemError } from './FileSystemError';
import { FileType } from './FileType';
import { toErrorErrnoException } from './isError';
import { Uri } from './uri';

type FileSystemProvider = vscode.FileSystemProvider;

async function createDirectory(uri: Uri): Promise<void> {
    function mkdir() {
        return fs.mkdir(uri.fsPath).catch((e) => {
            if (isErrorWithCode(e, 'EEXIST')) return;
            throw e;
        });
    }

    try {
        return await mkdir().catch(async (e) => {
            if (isErrorWithCode(e, 'ENOENT')) {
                // create parent and retry
                await createDirectory(Uri.joinPath(uri, '..'));
                return mkdir();
            }
            throw e;
        });
    } catch (e) {
        throw toFileSystemError(uri, e);
    }
}

async function readFile(uri: Uri): Promise<Uint8Array> {
    try {
        return await fs.readFile(uri.fsPath);
    } catch (e) {
        throw toFileSystemError(uri, e);
    }
}

async function writeFile(
    uri: Uri,
    content: Uint8Array,
    options: { readonly create: boolean; readonly overwrite: boolean },
): Promise<void> {
    try {
        const flag = (options.create ? 'w' : 'a') + (options.overwrite ? '' : 'x');
        if (options.create) {
            await createDirectory(Uri.joinPath(uri, '..'));
        }
        return await fs.writeFile(uri.fsPath, content, { flag });
    } catch (e) {
        throw toFileSystemError(uri, e);
    }
}

function isErrorWithCode(e: unknown, code: string): boolean {
    return toErrorErrnoException(e).code === code;
}

async function stat(uri: Uri): Promise<vscode.FileStat> {
    try {
        const stat = await fs.stat(uri.fsPath);

        return {
            type: stat.isFile()
                ? FileType.File
                : stat.isDirectory()
                ? FileType.Directory
                : stat.isSymbolicLink()
                ? FileType.SymbolicLink
                : FileType.Unknown,
            ctime: stat.ctimeMs,
            mtime: stat.mtimeMs,
            size: stat.size,
        };
    } catch (e) {
        throw toFileSystemError(uri, e);
    }
}

export const nodeFileSystemProvider: FileSystemProvider = {
    createDirectory,
    readFile,
    writeFile,
    copy: jest.fn(),
    delete: jest.fn(),
    onDidChangeFile: jest.fn(),
    readDirectory: jest.fn(),
    rename: jest.fn(),
    stat,
    watch: jest.fn(),
};
