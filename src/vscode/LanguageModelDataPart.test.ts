import { describe, expect, test } from '@jest/globals';
import type * as vscode from 'vscode';

import { LanguageModelDataPart } from './LanguageModelDataPart';

describe('LanguageModelDataPart', () => {
    test('LanguageModelDataPart.text', () => {
        const part = LanguageModelDataPart.text('hello world', 'text/plain');
        expect(part.mimeType).toBe('text/plain');
        const decoder = new TextDecoder();
        expect(decoder.decode(part.data)).toBe('hello world');
        const part2 = LanguageModelDataPart.text('hello world');
        expect(part2.mimeType).toBe('text/plain');
        expect(JSON.stringify(part)).toBe(JSON.stringify(part2));

        // Check the type
        const vPart: vscode.LanguageModelDataPart = part;
        expect(vPart).toBe(part);
    });

    test('LanguageModelDataPart.json', () => {
        const obj = { name: 'hello world' };
        const part = LanguageModelDataPart.json(obj, 'text/x-json');
        expect(part.mimeType).toBe('text/x-json');
        const decoder = new TextDecoder();
        expect(JSON.parse(decoder.decode(part.data))).toEqual(obj);
        const part2 = LanguageModelDataPart.json(obj);
        expect(part2.mimeType).toBe('text/x-json');
        expect(JSON.stringify(part)).toBe(JSON.stringify(part2));
    });

    test('LanguageModelDataPart.image', () => {
        const svg = `\
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
            </svg>`;

        const encoder = new TextEncoder();
        const data = encoder.encode(svg);
        const part = LanguageModelDataPart.image(data, 'image/svg+xml');
        expect(part.mimeType).toBe('image/svg+xml');
        const decoder = new TextDecoder();
        expect(decoder.decode(part.data)).toBe(svg);
        const partFromText = LanguageModelDataPart.text(svg, 'image/svg+xml');
        expect(JSON.stringify(part)).toBe(JSON.stringify(partFromText));
    });
});
