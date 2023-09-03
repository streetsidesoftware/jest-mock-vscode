import { describe, expect, test, jest } from '@jest/globals';
import { createLanguages } from './languages';

describe('languages', () => {
    const languages = createLanguages(jest);
    test('getLanguages', async () => {
        const langs = await languages.getLanguages();
        expect(langs).toBeDefined();
        expect(langs.length).toBeGreaterThan(1);
    });
});
