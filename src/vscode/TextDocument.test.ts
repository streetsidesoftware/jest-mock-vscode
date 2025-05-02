import { describe, expect, test } from '@jest/globals';
import type * as vscode from 'vscode';

import { Range } from './extHostTypes';
import { MockTextDocument } from './TextDocument';
import { Uri } from './uri';

describe('Validate TextDocument', () => {
    test('create', () => {
        const uri = Uri.file(__filename);
        const td = MockTextDocument.create(uri, content());
        expect(td.getText()).toBe(content());
    });

    test.each`
        frag        | line | col
        ${'Line 2'} | ${2} | ${0}
        ${'Line 4'} | ${4} | ${2}
    `('positionAt/offsetAt $frag $line $col', ({ frag, line, col }: Record<string, any>) => {
        const doc = createDoc();
        const text = doc.getText();
        const offset = text.indexOf(frag);
        const pos = doc.positionAt(offset);
        expect(pos).toEqual(expect.objectContaining({ line, character: col }));
        expect(doc.offsetAt(pos)).toBe(offset);
    });

    test.each`
        key             | expected
        ${'fileName'}   | ${Uri.file(__filename).fsPath}
        ${'lineCount'}  | ${10}
        ${'languageId'} | ${'plaintext'}
        ${'isUntitled'} | ${false}
    `('simple getters $method', ({ key, expected }: Record<string, any>) => {
        const doc = createDoc();

        expect((doc as any)[key]).toEqual(expected);
    });

    test.each`
        searchFor           | expected
        ${'ge At Position'} | ${'Range'}
        ${'ne 4'}           | ${'Line'}
        ${'  Line 4'}       | ${undefined}
    `('getWordRangeAtPosition', ({ searchFor, expected }: Record<string, any>) => {
        const doc = createDoc();
        const pos = doc.positionAt(doc.getText().indexOf(searchFor));
        const r = doc.getWordRangeAtPosition(pos);
        expect(r && doc.getText(r)).toEqual(expected);
    });

    test.each`
        range              | expected
        ${r(0, 0, 4, 4)}   | ${r(0, 0, 4, 4)}
        ${r(3, 10, 10, 4)} | ${r(3, 1, 9, 3)}
    `('validateRange $range', ({ range, expected }) => {
        const doc = createDoc();
        expect(doc.validateRange(range)).toEqual(expected);
    });

    test('isDirty', () => {
        const doc = createDoc();
        expect(doc.isDirty).toEqual(false);
        MockTextDocument.setContents(doc, content());
        expect(doc.isDirty).toEqual(true);
    });

    test('save', async () => {
        const doc = createDoc();
        expect(await doc.save()).toEqual(false);
        MockTextDocument.setContents(doc, content());
        expect(() => doc.save()).toThrow('Method not implemented.');
    });

    test('lineAt', async () => {
        const doc = createDoc();
        
        const line1 = doc.lineAt(1)
        expect(line1.lineNumber).toEqual(1)
        expect(line1.text).toEqual('Line 1')
        expect(line1.firstNonWhitespaceCharacterIndex).toEqual(0)
        expect(line1.isEmptyOrWhitespace).toEqual(false)

        const line3 = doc.lineAt(3)
        expect(line3.lineNumber).toEqual(3)
        expect(line3.text).toEqual('')
        expect(line3.firstNonWhitespaceCharacterIndex).toEqual(0)
        expect(line3.isEmptyOrWhitespace).toEqual(true)

        const line4 = doc.lineAt(4)
        expect(line4.lineNumber).toEqual(4)
        expect(line4.text).toEqual('  Line 4')
        expect(line4.firstNonWhitespaceCharacterIndex).toEqual(2)
        expect(line4.isEmptyOrWhitespace).toEqual(false)
    });
});

function r(lineA: number, rowA: number, lineB: number, rowB: number): vscode.Range {
    return new Range(lineA, rowA, lineB, rowB);
}

function createDoc(): MockTextDocument {
    const uri = Uri.file(__filename);
    return MockTextDocument.create(uri, content());
}

function content() {
    return `
Line 1
Line 2

  Line 4

     Position 5
     get Word Range At Position

eof`;
}
