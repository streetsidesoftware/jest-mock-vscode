import type * as vscode from 'vscode';

import type { TestFramework } from '../TestFramework';
import { createNodeFileSystemProvider } from './fsNode';

export type FileSystem = vscode.FileSystem;
export type FileSystemProvider = vscode.FileSystemProvider;

export function createMockFileSystem(jest: TestFramework, provider?: FileSystemProvider): FileSystem {
    const _provider = provider ?? createMockFileSystemProvider(jest);
    const fs: FileSystem = {
        stat: jest.fn((...p) => Promise.resolve(_provider.stat(...p))),
        readDirectory: jest.fn((...p) => Promise.resolve(_provider.readDirectory(...p))),
        readFile: jest.fn((...p) => Promise.resolve(_provider.readFile(...p))),
        rename: jest.fn((oldUri, newUri, opt) =>
            Promise.resolve(_provider.rename(oldUri, newUri, { ...opt, overwrite: opt?.overwrite ?? false })),
        ),
        createDirectory: jest.fn((...p) => Promise.resolve(_provider.createDirectory(...p))),
        copy: jest.fn((src, target, opt) =>
            Promise.resolve(_provider.copy?.(src, target, { ...opt, overwrite: opt?.overwrite ?? true })),
        ),
        writeFile: jest.fn((...p) => Promise.resolve(_provider.writeFile(...p, { create: true, overwrite: true }))),
        delete: jest.fn((uri, opt) => Promise.resolve(_provider.delete(uri, { recursive: opt?.recursive ?? true }))),
        isWritableFileSystem: jest.fn(),
    };

    return fs;
}

export function createMockFileSystemProvider(jest: TestFramework): FileSystemProvider {
    const fsn = createNodeFileSystemProvider(jest);
    const fsp: FileSystemProvider = {
        copy: jest.fn(),
        createDirectory: jest.fn(fsn.createDirectory),
        delete: jest.fn(),
        onDidChangeFile: jest.fn(),
        readDirectory: jest.fn(),
        readFile: jest.fn(fsn.readFile),
        rename: jest.fn(),
        stat: jest.fn(fsn.stat),
        watch: jest.fn(),
        writeFile: jest.fn(fsn.writeFile),
    };
    return fsp;
}
