# VS Code Mocks for Jest and Vitest

This packages is was created to help with the painful process of running unit tests on VS Code extensions.

It was create to support [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker).

## Installation

```sh
npm install --save-dev jest-mock-vscode
```

## Jest

Based upon [Manual Mocks · Jest](https://jestjs.io/docs/manual-mocks) add the following file to your project:

**`__mocks__/vscode.js`**

<!--- @@inject: test-packages/jest-integration/src/__mocks__/vscode.js --->

```js
/* eslint-disable node/no-unpublished-require */
module.exports = require('jest-mock-vscode').createVSCodeMock(jest);
```

<!--- @@inject-end: test-packages/jest-integration/src/__mocks__/vscode.js --->

### Usage Jest

#### Example Test `vscode.workspace`

<!--- @@inject: test-packages/jest-integration/src/sample.workspace.test.ts --->

```ts
import { Uri, workspace, WorkspaceFolder } from 'vscode';

const rootUri = Uri.file(__dirname);
const workspaceFolder1: WorkspaceFolder = {
  uri: Uri.joinPath(rootUri, 'Folder1'),
  name: 'Folder1',
  index: 0,
};

const workspaceFolder2: WorkspaceFolder = {
  uri: Uri.joinPath(rootUri, 'Folder2'),
  name: 'Folder2',
  index: 1,
};

describe('workspace', () => {
  test('getWorkspaceFolder', () => {
    const uri = Uri.joinPath(workspaceFolder1.uri, 'code.test.ts');
    const uri2 = Uri.joinPath(workspaceFolder2.uri, 'test.txt');

    const spy = jest.spyOn(workspace, 'workspaceFolders', 'get');
    spy.mockReturnValue([workspaceFolder1, workspaceFolder2]);

    expect(workspace.workspaceFolders).toEqual([workspaceFolder1, workspaceFolder2]);
    expect(workspace.getWorkspaceFolder(uri)).toEqual(workspaceFolder1);
    expect(workspace.getWorkspaceFolder(uri2)).toEqual(workspaceFolder2);
  });
});
```

<!--- @@inject-end: test-packages/jest-integration/src/sample.workspace.test.ts --->

## Vitest

Based upon:

- [`vi.Mock()` | Vitest](https://vitest.dev/api/vi.html#vi-mock)
- [Mocking | Guide | Vitest](https://vitest.dev/guide/mocking.html#modules)
- [Mock Functions | Vitest](https://vitest.dev/api/mock.html)

You can add the following file to your project:

**`__mocks__/vscode.cts`**

<!--- @@inject: test-packages/vitest-integration/__mocks__/vscode.cts --->

```typescript
import { vi } from 'vitest';
import { createVSCodeMock } from 'jest-mock-vscode';

const vscode = createVSCodeMock(vi);

module.exports = vscode;
```

<!--- @@inject-end: test-packages/vitest-integration/__mocks__/vscode.cts --->

### Usage Vitest

<!--- @@inject: test-packages/vitest-integration/src/sample.workspace.test.ts --->

```ts
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Uri, workspace, type WorkspaceFolder, window } from 'vscode';

vi.mock('vscode');

const testFileUri = Uri.file(__filename);
const rootUri = Uri.file(__dirname);
const workspaceFolder1: WorkspaceFolder = {
  uri: Uri.joinPath(rootUri, 'Folder1'),
  name: 'Folder1',
  index: 0,
};

const workspaceFolder2: WorkspaceFolder = {
  uri: Uri.joinPath(rootUri, 'Folder2'),
  name: 'Folder2',
  index: 1,
};

describe('vscode.workspace', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('getWorkspaceFolder', () => {
    const uri = Uri.joinPath(workspaceFolder1.uri, 'code.test.ts');
    const uri2 = Uri.joinPath(workspaceFolder2.uri, 'test.txt');

    const spy = vi.spyOn(workspace, 'workspaceFolders', 'get');
    spy.mockReturnValue([workspaceFolder1, workspaceFolder2]);

    expect(workspace.workspaceFolders).toEqual([workspaceFolder1, workspaceFolder2]);
    expect(workspace.getWorkspaceFolder(uri)).toEqual(workspaceFolder1);
    expect(workspace.getWorkspaceFolder(uri2)).toEqual(workspaceFolder2);
  });

  test('openTextDocument', async () => {
    const uri = testFileUri;
    const doc = await workspace.openTextDocument(uri);
    expect(doc.uri).toEqual(uri);
    expect(doc.getText()).toContain("vi.mock('vscode');");
  });
});

describe('vscode.window', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('showTextDocument', async () => {
    const uri = testFileUri;
    const doc = await workspace.openTextDocument(uri);
    const editor = await window.showTextDocument(doc);
    expect(editor.document).toBe(doc);
  });
});
```

<!--- @@inject-end: test-packages/vitest-integration/src/sample.workspace.test.ts --->

### Using `vi.mock` factory

```ts
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Uri, workspace, type WorkspaceFolder } from 'vscode';

vi.mock('vscode', async () => (await import('jest-mock-vscode')).createVSCodeMock(vi));

describe(/* ... */);
```

## Reading Fixtures as TextDocument

```ts
import { readTextDocument } from 'jest-mock-vscode';
import { Uri } from 'vscode';

// vi.mock('vscode')

const pathToFixture = __filename;

const doc = await readTextDocument(Uri.file(pathToFixture));
```

## Default Mock Implementations for most VS Code classes and interfaces

Here are a few of items that have been implemented. Most of them are based upon the code from VS Code.

- CodeAction
- ColorTheme
- CompletionItem
- Diagnostic
- language
- MarkdownString
- Position
- Range
- Selection
- TaskGroup
- TextDocument
- TextEditor
- Uri
- workspace
- WorkspaceEdit

## Migrating from 2.x to 3.x

Migration is only necessary if you used any of the following:

```js
new MockWorkspace(...)
new MockTabGroups(...)
new MockTextEditor(...)
```

It is now necessary to use a create function.

- `new MockWorkspace(...)` -> `createWorkspace(...)`
- `new MockTabGroups(...)` -> `createMockTabGroups(...)`
- `new MockTextEditor(...)` -> `createMockTextEditor(...)`

## Migrating from 1.x to 2.x

**`__mocks__/vscode.js`**

```diff
-module.exports = require('jest-mock-vscode');
+module.exports = require('jest-mock-vscode').createVSCodeMock(jest);
```

## Notes

The idea is to use as much of the VS Code as possible. For example the `vscode-uri` is used to implement the `Uri` class. If Microsoft publishes a set of core classes, they will be used.

## License

- Code copied from VS Code belongs to Microsoft.
- All other code falls under the MIT License
