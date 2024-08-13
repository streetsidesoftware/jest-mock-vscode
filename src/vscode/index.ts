export * from './baseTypes';
export * from './CodeAction';
export { EventEmitter } from './EventEmitter';
export * from './extHostTypes';
export { FileSystemError } from './FileSystemError';
export { createMockFileSystem, createMockFileSystemProvider } from './fs';
export { createLanguages, Languages } from './languages';
export * from './MarkdownString';
export type { MockTabGroups } from './TabGroups';
export { createMockTabGroups } from './TabGroups';
export * from './TextDocument';
export type { MockTextEditor } from './TextEditor';
export { createMockTextEditor } from './TextEditor';
export { TypeHierarchyItem } from './TypeHierarchyItem';
export * from './uri';
export type { Window } from './window';
export { createWindow } from './window';
export { createWorkspace, MockWorkspace, Workspace } from './workspace';
export {
    createMockWorkspaceConfiguration,
    MockWorkspaceConfiguration,
    MockWorkspaceConfigurationData,
    WorkspaceConfiguration,
} from './WorkspaceConfiguration';
