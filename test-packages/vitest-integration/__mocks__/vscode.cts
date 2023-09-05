import { vi } from 'vitest';
import { createVSCodeMock } from 'jest-mock-vscode';

const vscode = createVSCodeMock(vi);

module.exports = vscode;
