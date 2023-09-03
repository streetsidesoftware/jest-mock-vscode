export type { TestFramework } from './TestFramework';
export type { Mock } from './TestFrameworkTypes';
export {
    createLanguages,
    createMockFileSystem,
    createMockFileSystemProvider,
    createMockWorkspaceConfiguration,
} from './vscode';
export type { MockWorkspaceConfigurationData } from './vscode';
export { createVSCodeMock } from './vscode-mock';
export { createTextDocument, readTextDocument } from './vscodeTypesHelper';
