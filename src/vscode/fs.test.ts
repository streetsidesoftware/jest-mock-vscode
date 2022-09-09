import { createMockFileSystem } from './fs';
import { Uri } from './uri';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { FileSystemError } from './FileSystemError';

const rootTemp = Uri.joinPath(Uri.file(__dirname), '../../temp/' + path.basename(__filename, '.ts'));

describe('fs', () => {
    const fs = createMockFileSystem();

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
});
