/**
 * @type { import("eslint").Linter.Config }
 */
const config = {
    root: true,
    env: {
        es2020: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:node/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:promise/recommended',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: [
        '**/[Tt]emp/**',
        '**/*.d.ts',
        '**/*.map',
        '**/coverage/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/.docusaurus/**',
        'docs/_site/**',
        'website',
        'website/**', // checked with a different config
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    overrides: [
        {
            files: '**/*.ts',
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            rules: {
                '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
                'node/no-missing-import': [
                    'error',
                    {
                        tryExtensions: ['.js', '.d.ts', '.ts'],
                    },
                ],
                'node/no-unsupported-features/es-syntax': [
                    'error',
                    {
                        ignores: ['modules'],
                    },
                ],
            },
        },
        {
            files: ['**/*.test.ts', '**/*.spec.ts', '**/__mocks__/**'],
            extends: 'plugin:jest/recommended',
            env: {
                jest: true,
            },
            rules: {
                'import/no-unresolved': 'off',
                'node/no-missing-import': 'off',
                'node/no-unpublished-import': 'off',
                'jest/valid-title': 'warn',
            },
        },
    ],
};

module.exports = config;
