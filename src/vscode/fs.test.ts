import { createMockFileSystem } from './fs';
import { Uri } from './uri';
import { promises as fsp } from 'fs';

const rootTemp = Uri.joinPath(Uri.file(__dirname), '../../temp/fsNode');

describe('fs', () => {
    const fs = createMockFileSystem();

    test('createDirectory', async () => {
        await expect(fs.createDirectory(Uri.file(__dirname))).resolves.toBeUndefined();
    });

    test('readFile', async () => {
        const content = Buffer.from(await fs.readFile(Uri.file(__filename))).toString('utf8');
        expect(content).toContain('this bit of text');
    });

    test('writeFile', async () => {
        const tempDir = Uri.joinPath(rootTemp, 'writeFile');
        const content = await fs.readFile(Uri.file(__filename));
        const uriTempFile = Uri.joinPath(tempDir, 'depth/test.txt');
        await fsp.rm(tempDir.fsPath, { recursive: true });
        await expect(fs.writeFile(uriTempFile, content)).resolves.toBeUndefined();
        const result = await fs.readFile(uriTempFile);
        expect(result).toEqual(content);
    });
});
