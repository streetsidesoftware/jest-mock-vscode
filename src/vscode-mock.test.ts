import { describe, expect, it, jest } from '@jest/globals';

// import * as vscode from 'vscode';
import { createVSCodeMock } from './vscode-mock';
import * as path from 'path';

describe('Validate Mock', () => {
    const vscodeMock = createVSCodeMock(jest);

    it('vscodeMock.Uri', () => {
        const uri = vscodeMock.Uri.file(__filename);
        const uriDir = vscodeMock.Uri.file(__dirname);
        const joined = vscodeMock.Uri.joinPath(uriDir, path.basename(__filename));
        expect(joined.toString()).toBe(uri.toString());
    });
});
