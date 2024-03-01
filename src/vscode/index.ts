export * from './CodeAction';
export { FileSystemError } from './FileSystemError';
export * from './MarkdownString';
export * from './TextDocument';
export {
    MockWorkspaceConfiguration,
    MockWorkspaceConfigurationData,
    WorkspaceConfiguration,
    createMockWorkspaceConfiguration,
} from './WorkspaceConfiguration';
export * from './baseTypes';
export * from './extHostTypes';
export { createMockFileSystem, createMockFileSystemProvider } from './fs';
export * from './uri';
export { MockWorkspace, Workspace, createWorkspace } from './workspace';

export type { MockTextEditor } from './TextEditor';
export { createMockTextEditor } from './TextEditor';
export { TypeHierarchyItem } from './TypeHierarchyItem';
export { Languages, createLanguages } from './languages';
export { Window, createWindow } from './window';
