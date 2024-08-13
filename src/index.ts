export type { TestFramework } from './TestFramework';
export type { Mock } from './TestFrameworkTypes';
export type {
    MockTabGroups,
    MockTextDocument,
    MockTextEditor,
    MockWorkspace,
    MockWorkspaceConfigurationData,
} from './vscode';
export {
    createLanguages,
    createMockFileSystem,
    createMockFileSystemProvider,
    createMockTabGroups,
    createMockTextEditor,
    createMockWorkspaceConfiguration,
    createWindow,
    createWorkspace,
} from './vscode';
export { createVSCodeMock } from './vscode-mock';
export { createTextDocument, readTextDocument } from './vscodeTypesHelper';
