import type * as vscode from 'vscode';
import type { NotebookEdit, Range, SnippetTextEdit, TextEdit, Uri as URI } from 'vscode';

import { coalesceInPlace } from './arrays';
import { FileEditType } from './baseTypes';
import type { IFileOperation, IFileTextEdit } from './extHostTypes';
import * as vsMock from './extHostTypes';
import { ResourceMap } from './ResourceMap';

type WorkspaceEditEntry = IFileOperation | IFileTextEdit | IFileCellEdit | ICellEdit;

/**
 * EXPLICIT any
 */
type ANY = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface IFileCellEdit {
    _type: FileEditType.Cell;
    uri: URI;
    // edit?: ICellPartialMetadataEdit | IDocumentMetadataEdit;
    notebookMetadata?: Record<string, ANY>;
    metadata?: vscode.WorkspaceEditEntryMetadata;
}

export interface ICellEdit {
    _type: FileEditType.CellReplace;
    metadata?: vscode.WorkspaceEditEntryMetadata;
    uri: URI;
    index: number;
    count: number;
    cells: vscode.NotebookCellData[];
}

export class WorkspaceEdit implements vscode.WorkspaceEdit {
    private readonly _edits: WorkspaceEditEntry[] = [];

    _allEntries(): readonly WorkspaceEditEntry[] {
        return this._edits;
    }

    // --- file

    renameFile(
        from: vscode.Uri,
        to: vscode.Uri,
        options?: { overwrite?: boolean; ignoreIfExists?: boolean },
        metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        this._edits.push({ _type: FileEditType.File, from, to, options, metadata });
    }

    createFile(
        uri: vscode.Uri,
        options?: { overwrite?: boolean; ignoreIfExists?: boolean },
        metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        this._edits.push({ _type: FileEditType.File, from: undefined, to: uri, options, metadata });
    }

    deleteFile(
        uri: vscode.Uri,
        options?: { recursive?: boolean; ignoreIfNotExists?: boolean },
        metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        this._edits.push({ _type: FileEditType.File, from: uri, to: undefined, options, metadata });
    }

    // --- notebook

    replaceNotebookMetadata(
        _uri: URI,
        _value: Record<string, ANY>,
        _metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        throw new Error('Method not implemented.');
    }

    replaceNotebookCells(
        uri: URI,
        range: vscode.NotebookRange,
        cells: vscode.NotebookCellData[],
        metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void;
    replaceNotebookCells(
        uri: URI,
        start: number,
        end: number,
        cells: vscode.NotebookCellData[],
        metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void;
    replaceNotebookCells(
        _uri: URI,
        _startOrRange: number | vscode.NotebookRange,
        _endOrCells: number | vscode.NotebookCellData[],
        _cellsOrMetadata?: vscode.NotebookCellData[] | vscode.WorkspaceEditEntryMetadata,
        _metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        throw new Error('Method not implemented.');
    }

    replaceNotebookCellMetadata(
        _uri: URI,
        _index: number,
        _cellMetadata: Record<string, ANY>,
        _metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        throw new Error('Method not implemented.');
    }

    // --- text

    replace(uri: URI, range: Range, newText: string, metadata?: vscode.WorkspaceEditEntryMetadata): void {
        this._edits.push({ _type: FileEditType.Text, uri, edit: new vsMock.TextEdit(range, newText), metadata });
    }

    insert(
        resource: URI,
        position: vscode.Position,
        newText: string,
        metadata?: vscode.WorkspaceEditEntryMetadata,
    ): void {
        this.replace(resource, new vsMock.Range(position, position), newText, metadata);
    }

    delete(resource: URI, range: Range, metadata?: vscode.WorkspaceEditEntryMetadata): void {
        this.replace(resource, range, '', metadata);
    }

    // --- text (Map-like)

    has(uri: URI): boolean {
        return this._edits.some((edit) => edit._type === FileEditType.Text && edit.uri.toString() === uri.toString());
    }

    /**
     * Set (and replace) notebook edits for a resource.
     *
     * @param uri A resource identifier.
     * @param edits An array of edits.
     */
    set(uri: URI, edits: NotebookEdit[]): void;

    /**
     * Set (and replace) notebook edits with metadata for a resource.
     *
     * @param uri A resource identifier.
     * @param edits An array of edits.
     */
    set(uri: URI, edits: [NotebookEdit, vscode.WorkspaceEditEntryMetadata][]): void;

    /**
     * Set (and replace) text edits or snippet edits for a resource.
     *
     * @param uri A resource identifier.
     * @param edits An array of edits.
     */
    set(uri: URI, edits: (TextEdit | SnippetTextEdit)[]): void;

    /**
     * Set (and replace) text edits or snippet edits with metadata for a resource.
     *
     * @param uri A resource identifier.
     * @param edits An array of edits.
     */
    set(uri: URI, edits: [TextEdit | vscode.SnippetTextEdit, vscode.WorkspaceEditEntryMetadata][]): void;

    set(
        uri: URI,
        edits: (
            | TextEdit
            | NotebookEdit
            | SnippetTextEdit
            | [TextEdit | vscode.SnippetTextEdit | NotebookEdit, vscode.WorkspaceEditEntryMetadata]
        )[],
    ): void {
        if (!edits) {
            // remove all text edits for `uri`
            for (let i = 0; i < this._edits.length; i++) {
                const element = this._edits[i];
                if (element._type === FileEditType.Text && element.uri.toString() === uri.toString()) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this._edits[i] = undefined!; // will be coalesced down below
                }
            }
            coalesceInPlace(this._edits);
        } else {
            // append edit to the end
            for (const edit of edits) {
                if (Array.isArray(edit)) {
                    throw new Error('Edit pairs not implemented.');
                }
                if (!isTextEdit(edit)) {
                    throw new Error('Only TextEdits are currently supported.');
                }
                if (edit) {
                    this._edits.push({ _type: FileEditType.Text, uri, edit });
                }
            }
        }
    }

    get(uri: URI): TextEdit[] {
        const res: TextEdit[] = [];
        for (const candidate of this._edits) {
            if (candidate._type === FileEditType.Text && candidate.uri.toString() === uri.toString()) {
                res.push(candidate.edit);
            }
        }
        return res;
    }

    entries(): [URI, TextEdit[]][] {
        const textEdits = new ResourceMap<[URI, TextEdit[]]>();
        for (const candidate of this._edits) {
            if (candidate._type === FileEditType.Text) {
                let textEdit = textEdits.get(candidate.uri);
                if (!textEdit) {
                    textEdit = [candidate.uri, []];
                    textEdits.set(candidate.uri, textEdit);
                }
                textEdit[1].push(candidate.edit);
            }
        }
        return [...textEdits.values()];
    }

    get size(): number {
        return this.entries().length;
    }

    toJSON(): ANY {
        return this.entries();
    }
}

function isTextEdit(edit: TextEdit | SnippetTextEdit | NotebookEdit): edit is TextEdit {
    const tEdit = edit as TextEdit;
    return typeof tEdit.newText === 'string';
}
