import type * as vscode from 'vscode';

import type { GenericTestFramework, TestFramework } from './TestFramework';
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
    createLanguages,
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
} from './vscode';
import { FilePermission, FileType } from './vscode/FileType';
import { LanguageModelDataPart } from './vscode/LanguageModelDataPart';
import { createTasks } from './vscode/tasks';
import { createWindow } from './vscode/window';
import { createWorkspace } from './vscode/workspace';
import { WorkspaceEdit } from './vscode/WorkspaceEdit';

type VSCode = typeof vscode;

type OnlyKeyOf<T, K extends keyof T> = K;

type NotImplemented = OnlyKeyOf<
    VSCode,
    | 'authentication'
    | 'BranchCoverage'
    | 'Breakpoint'
    | 'CancellationError'
    | 'CancellationTokenSource'
    | 'chat'
    | 'ChatRequestTurn'
    | 'ChatResponseAnchorPart'
    | 'ChatResponseCommandButtonPart'
    | 'ChatResponseFileTreePart'
    | 'ChatResponseMarkdownPart'
    | 'ChatResponseProgressPart'
    | 'ChatResponseReferencePart'
    | 'ChatResponseTurn'
    | 'ChatResultFeedbackKind'
    | 'CodeActionTriggerKind'
    | 'comments'
    | 'CommentThreadState'
    | 'CustomExecution'
    | 'DataTransfer'
    | 'DataTransferItem'
    | 'DebugAdapterExecutable'
    | 'DebugAdapterNamedPipeServer'
    | 'DebugAdapterServer'
    | 'DebugStackFrame'
    | 'DebugThread'
    | 'DeclarationCoverage'
    | 'DocumentDropEdit'
    | 'DocumentDropOrPasteEditKind'
    | 'DocumentPasteEdit'
    | 'DocumentPasteTriggerKind'
    | 'env'
    | 'extensions'
    | 'FileCoverage'
    | 'FileDecoration'
    | 'FunctionBreakpoint'
    | 'Hover'
    | 'IndentAction'
    | 'InlayHint'
    | 'InlayHintKind'
    | 'InlayHintLabelPart'
    | 'InlineCompletionItem'
    | 'InlineCompletionList'
    | 'InlineCompletionTriggerKind'
    | 'InlineValueEvaluatableExpression'
    | 'InlineValueText'
    | 'InlineValueVariableLookup'
    | 'InputBoxValidationSeverity'
    | 'l10n'
    | 'LanguageModelChatMessage'
    | 'LanguageModelChatMessageRole'
    | 'LanguageModelChatToolMode'
    | 'LanguageModelError'
    | 'LanguageModelPromptTsxPart'
    | 'LanguageModelTextPart'
    | 'LanguageModelToolCallPart'
    | 'LanguageModelToolResult'
    | 'LanguageModelToolResultPart'
    | 'LanguageStatusSeverity'
    | 'LinkedEditingRanges'
    | 'lm'
    | 'McpHttpServerDefinition'
    | 'McpStdioServerDefinition'
    | 'NotebookCellData'
    | 'NotebookCellKind'
    | 'NotebookCellOutput'
    | 'NotebookCellOutputItem'
    | 'NotebookCellStatusBarItem'
    | 'NotebookControllerAffinity'
    | 'NotebookData'
    | 'NotebookEdit'
    | 'NotebookRange'
    | 'notebooks'
    | 'ParameterInformation'
    | 'ProcessExecution'
    | 'QuickInputButtons'
    | 'QuickPickItemKind'
    | 'RelativePattern'
    | 'scm'
    | 'SemanticTokensBuilder'
    | 'ShellExecution'
    | 'SignatureHelp'
    | 'SignatureInformation'
    | 'SnippetTextEdit'
    | 'SourceBreakpoint'
    | 'StatementCoverage'
    | 'TabInputCustom'
    | 'TabInputNotebook'
    | 'TabInputNotebookDiff'
    | 'TabInputTerminal'
    | 'TabInputText'
    | 'TabInputTextDiff'
    | 'TabInputWebview'
    | 'Task'
    | 'TelemetryTrustedValue'
    | 'TerminalExitReason'
    | 'TerminalLink'
    | 'TerminalLocation'
    | 'TerminalProfile'
    | 'TerminalShellExecutionCommandLineConfidence'
    | 'TestCoverageCount'
    | 'TestMessage'
    | 'TestMessageStackFrame'
    | 'TestRunProfileKind'
    | 'TestRunRequest'
    | 'tests'
    | 'TestTag'
    | 'TextDocumentChangeReason'
    | 'TextEditorCursorStyle'
    | 'TreeItemCheckboxState'
    | 'UIKind'
>;

export type VSCodeMock = Omit<VSCode, NotImplemented>;

/**
 * To use.
 * In your repository add the file:
 * `__mocks__/vscode.js`
 * ```js
 * module.exports = require('jest-mock-vscode').createVSCodeMock(jest);
 * ```
 */
export function createVSCodeMock(testFramework: GenericTestFramework): VSCodeMock {
    const tf: TestFramework = testFramework as TestFramework;
    const OverviewRulerLane: VSCode['OverviewRulerLane'] = {
        Left: 1,
        Center: 2,
        Right: 4,
        Full: 7,
    };

    const debug: VSCode['debug'] = {
        onDidTerminateDebugSession: tf.fn(),
        startDebugging: tf.fn(),
        registerDebugAdapterDescriptorFactory: tf.fn(),
    } as unknown as VSCode['debug'];

    const commands: VSCode['commands'] = {
        executeCommand: tf.fn(),
        registerCommand: tf.fn(),
        getCommands: tf.fn(),
        registerTextEditorCommand: tf.fn(),
    };

    const workspace = createWorkspace(tf);
    const window = createWindow(tf, workspace);
    const tasks = createTasks(tf);
    const languages = createLanguages(tf);

    const code: VSCodeMock = {
        version: '1.95.0',

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
        LanguageModelDataPart,
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
