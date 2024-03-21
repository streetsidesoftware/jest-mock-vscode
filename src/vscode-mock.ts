// eslint-disable-next-line node/no-missing-import
import type * as vscode from 'vscode';
import { TestFramework } from './TestFramework';
import {
    CallHierarchyIncomingCall,
    CallHierarchyItem,
    CallHierarchyOutgoingCall,
    CodeAction,
    CodeActionKind,
    CodeLens,
    Color,
    ColorInformation,
    ColorPresentation,
    ColorThemeKind,
    CommentMode,
    CommentThreadCollapsibleState,
    CompletionItem,
    CompletionItemKind,
    CompletionItemTag,
    CompletionList,
    CompletionTriggerKind,
    ConfigurationTarget,
    DebugAdapterInlineImplementation,
    DebugConfigurationProviderTriggerKind,
    DebugConsoleMode,
    DecorationRangeBehavior,
    Diagnostic,
    DiagnosticRelatedInformation,
    DiagnosticSeverity,
    DiagnosticTag,
    Disposable,
    DocumentHighlight,
    DocumentHighlightKind,
    DocumentLink,
    DocumentSymbol,
    EndOfLine,
    EnvironmentVariableMutatorType,
    EvaluatableExpression,
    EventEmitter,
    ExtensionKind,
    ExtensionMode,
    FileChangeType,
    FileSystemError,
    FoldingRange,
    FoldingRangeKind,
    Location,
    LogLevel,
    MarkdownString,
    NotebookCellStatusBarAlignment,
    NotebookEditorRevealType,
    Position,
    ProgressLocation,
    Range,
    Selection,
    SelectionRange,
    SemanticTokens,
    SemanticTokensEdit,
    SemanticTokensEdits,
    SemanticTokensLegend,
    ShellQuoting,
    SignatureHelpTriggerKind,
    SnippetString,
    StatusBarAlignment,
    SymbolInformation,
    SymbolKind,
    SymbolTag,
    SyntaxTokenType,
    TaskGroup,
    TaskPanelKind,
    TaskRevealKind,
    TaskScope,
    TextDocumentSaveReason,
    TextEdit,
    TextEditorLineNumbersStyle,
    TextEditorRevealType,
    TextEditorSelectionChangeKind,
    ThemeColor,
    ThemeIcon,
    TreeItem,
    TreeItemCollapsibleState,
    TypeHierarchyItem,
    Uri,
    ViewColumn,
    createLanguages,
} from './vscode';
import { createWindow } from './vscode/window';
import { createWorkspace } from './vscode/workspace';
import { WorkspaceEdit } from './vscode/WorkspaceEdit';
import { FilePermission, FileType } from './vscode/FileType';
import { createTasks } from './vscode/tasks';

type VSCode = typeof vscode;

type NotImplemented =
    | 'CancellationError'
    | 'CancellationTokenSource'
    | 'CodeActionTriggerKind'
    | 'Hover'
    | 'InlineValueText'
    | 'InlineValueVariableLookup'
    | 'InputBoxValidationSeverity'
    | 'QuickPickItemKind'
    | 'RelativePattern'
    | 'InlineValueEvaluatableExpression'
    | 'SnippetTextEdit'
    | 'NotebookEdit'
    | 'SemanticTokensBuilder'
    | 'ParameterInformation'
    | 'SignatureInformation'
    | 'SignatureHelp'
    | 'InlineCompletionList'
    | 'InlineCompletionTriggerKind'
    | 'InlineCompletionItem'
    | 'InlayHintKind'
    | 'InlayHintLabelPart'
    | 'InlayHint'
    | 'LinkedEditingRanges'
    | 'DocumentDropEdit'
    | 'IndentAction'
    | 'LanguageStatusSeverity'
    | 'TerminalLocation'
    | 'TerminalLink'
    | 'TerminalProfile'
    | 'FileDecoration'
    | 'ShellExecution'
    | 'CustomExecution'
    | 'Task'
    | 'UIKind'
    | 'env'
    | 'ProcessExecution'
    | 'DataTransferItem'
    | 'DataTransfer'
    | 'QuickInputButtons'
    | 'TextDocumentChangeReason'
    | 'TreeItemCheckboxState'
    | 'TerminalExitReason'
    | 'NotebookCellKind'
    | 'NotebookRange'
    | 'NotebookCellOutputItem'
    | 'NotebookCellOutput'
    | 'NotebookCellData'
    | 'NotebookData'
    | 'NotebookControllerAffinity'
    | 'NotebookCellStatusBarItem'
    | 'notebooks'
    | 'scm'
    | 'DebugAdapterExecutable'
    | 'DebugAdapterServer'
    | 'DebugAdapterNamedPipeServer'
    | 'Breakpoint'
    | 'SourceBreakpoint'
    | 'FunctionBreakpoint'
    | 'extensions'
    | 'CommentThreadState'
    | 'comments'
    | 'authentication'
    | 'l10n'
    | 'tests'
    | 'TestRunProfileKind'
    | 'TestTag'
    | 'TestRunRequest'
    | 'TextEditorCursorStyle'
    | 'TestMessage'
    | 'TabInputText'
    | 'TabInputTextDiff'
    | 'TabInputCustom'
    | 'TabInputWebview'
    | 'TabInputNotebook'
    | 'TabInputNotebookDiff'
    | 'TabInputTerminal'
    | 'TelemetryTrustedValue';

export interface VSCodeMock extends Omit<VSCode, NotImplemented> {}

/**
 * To use.
 * In your repository add the file:
 * `__mocks__/vscode.js`
 * ```js
 * module.exports = require('jest-mock-vscode').createVSCodeMock(jest);
 * ```
 */
export function createVSCodeMock(jest: TestFramework): VSCodeMock {
    const OverviewRulerLane: VSCode['OverviewRulerLane'] = {
        Left: 1,
        Center: 2,
        Right: 4,
        Full: 7,
    };

    const debug: VSCode['debug'] = {
        onDidTerminateDebugSession: jest.fn(),
        startDebugging: jest.fn(),
        registerDebugAdapterDescriptorFactory: jest.fn(),
    } as unknown as VSCode['debug'];

    const commands: VSCode['commands'] = {
        executeCommand: jest.fn(),
        registerCommand: jest.fn(),
        getCommands: jest.fn(),
        registerTextEditorCommand: jest.fn(),
    };

    const workspace = createWorkspace(jest);
    const window = createWindow(jest, workspace);
    const tasks = createTasks(jest);
    const languages = createLanguages(jest);

    const code: VSCodeMock = {
        version: '1.81.0',

        CallHierarchyIncomingCall,
        CallHierarchyItem,
        CallHierarchyOutgoingCall,
        CodeAction,
        CodeActionKind,
        CodeLens,
        Color,
        ColorInformation,
        ColorPresentation,
        ColorThemeKind,
        commands,
        CommentMode,
        CommentThreadCollapsibleState,
        CompletionItem,
        CompletionItemKind,
        CompletionItemTag,
        CompletionList,
        CompletionTriggerKind,
        ConfigurationTarget,
        debug,
        DebugAdapterInlineImplementation,
        DebugConfigurationProviderTriggerKind,
        DebugConsoleMode,
        DecorationRangeBehavior,
        Diagnostic,
        DiagnosticRelatedInformation,
        DiagnosticSeverity,
        DiagnosticTag,
        Disposable,
        DocumentHighlight,
        DocumentHighlightKind,
        DocumentLink,
        DocumentSymbol,
        EndOfLine,
        EnvironmentVariableMutatorType,
        EvaluatableExpression,
        EventEmitter,
        ExtensionKind,
        ExtensionMode,
        FileChangeType,
        FilePermission,
        FileSystemError,
        FileType,
        FoldingRange,
        FoldingRangeKind,
        languages,
        Location,
        LogLevel,
        MarkdownString,
        NotebookCellStatusBarAlignment,
        NotebookEditorRevealType,
        OverviewRulerLane,
        Position,
        ProgressLocation,
        Range,
        Selection,
        SelectionRange,
        SemanticTokens,
        SemanticTokensEdit,
        SemanticTokensEdits,
        SemanticTokensLegend,
        ShellQuoting,
        SignatureHelpTriggerKind,
        SnippetString,
        StatusBarAlignment,
        SymbolInformation,
        SymbolKind,
        SymbolTag,
        SyntaxTokenType,
        TaskGroup,
        TaskPanelKind,
        TaskRevealKind,
        tasks,
        TaskScope,
        TextDocumentSaveReason,
        TextEdit,
        TextEditorLineNumbersStyle,
        TextEditorRevealType,
        TextEditorSelectionChangeKind,
        ThemeColor,
        ThemeIcon,
        TreeItem,
        TreeItemCollapsibleState,
        TypeHierarchyItem,
        Uri,
        ViewColumn,
        window,
        workspace,
        WorkspaceEdit,
    };

    return code;
}
