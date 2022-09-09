import { nodeFileSystemProvider as fs } from './fsNode';
import { Uri } from './uri';
import { promises as fsp } from 'fs';
import * as path from 'path';

const rootTemp = Uri.joinPath(Uri.file(__dirname), '../../temp/' + path.basename(__filename, '.ts'));

describe('fs', () => {
    test.each`
        dir
        ${'.'}
        ${'a/b/c/d'}
    `('createDirectory $dir', async ({ dir }) => {
        const tempDir = Uri.joinPath(rootTemp, 'createDirectory');
        const uri = Uri.joinPath(tempDir, dir);
        await expect(fs.createDirectory(uri)).resolves.toBeUndefined();
    });

    test('readFile', async () => {
        const content = Buffer.from(await fs.readFile(Uri.file(__filename))).toString('utf8');
        expect(content).toContain('this bit of text');
    });

    test('writeFile', async () => {
        const tempDir = Uri.joinPath(rootTemp, 'writeFile');
        const content = await fs.readFile(Uri.file(__filename));
        const uriTempFile = Uri.joinPath(tempDir, 'depth/test.txt');
        await fsp.rm(tempDir.fsPath, { recursive: true }).catch((_) => undefined);
        await expect(fs.writeFile(uriTempFile, content, { create: true, overwrite: true })).resolves.toBeUndefined();
        const result = await fs.readFile(uriTempFile);
        expect(result).toEqual(content);
    });
});
