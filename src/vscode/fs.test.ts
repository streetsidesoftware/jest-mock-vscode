import { describe, expect, jest, test } from '@jest/globals';
import { promises as fsp } from 'fs';
import * as path from 'path';

import { FileSystemError } from './FileSystemError';
import { FileType } from './FileType';
import { createMockFileSystem } from './fs';
import { Uri } from './uri';

const rootTemp = Uri.joinPath(Uri.file(__dirname), '../../temp/' + path.basename(__filename, '.ts'));

const oc = expect.objectContaining;

describe('fs', () => {
    const fs = createMockFileSystem(jest);

    test('createDirectory', async () => {
        await expect(fs.createDirectory(Uri.file(__dirname))).resolves.toBeUndefined();
    });

    test('readFile', async () => {
        const content = Buffer.from(await fs.readFile(Uri.file(__filename))).toString('utf8');
        expect(content).toContain('this bit of text');
    });

    test('file does not exist', async () => {
        const uriFile = Uri.joinPath(Uri.file(__dirname), 'Does_Not_Exist.txt');
        const result = await Promise.resolve(fs.readFile(uriFile)).catch((e) => e);
        expect(result).toBeInstanceOf(FileSystemError);
        expect(result instanceof FileSystemError).toBe(true);
    });

    test('writeFile', async () => {
        const tempDir = Uri.joinPath(rootTemp, 'writeFile');
        const content = await fs.readFile(Uri.file(__filename));
        const uriTempFile = Uri.joinPath(tempDir, 'depth/test.txt');
        await fsp.rm(tempDir.fsPath, { recursive: true }).catch((_) => undefined);
        await expect(fs.writeFile(uriTempFile, content)).resolves.toBeUndefined();
        const result = await fs.readFile(uriTempFile);
        expect(result).toEqual(content);
    });

    test.each`
        uri                     | expected
        ${Uri.file(__dirname)}  | ${oc({ type: FileType.Directory })}
        ${Uri.file(__filename)} | ${oc({ type: FileType.File })}
    `('stat $uri', async ({ uri, expected }: Record<string, any>) => {
        const result = await fs.stat(uri);
        expect(result).toEqual(expected);
    });

    test.each`
        uri                                        | expected
        ${Uri.joinPath(rootTemp, 'not_found.txt')} | ${oc({ code: 'FileNotFound' })}
    `('stat error $uri', async ({ uri, expected }: Record<string, any>) => {
        const result = await Promise.resolve(fs.stat(uri)).catch((e) => e);
        expect(result).toEqual(expected);
    });
});
