// eslint-disable-next-line node/no-missing-import
import type * as vscode from 'vscode';
import * as vscodeUri from 'vscode-uri';

/**
 * EXPLICIT any
 */
type ANY = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export class Uri extends vscodeUri.URI {
    static joinPath(uri: Uri, ...parts: string[]): Uri {
        return vscodeUri.Utils.joinPath(uri, ...parts);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static isUri(uri: ANY): uri is Uri {
        return uri instanceof Uri || uri instanceof vscodeUri.URI;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isUri(u: ANY): u is vscode.Uri {
    return Uri.isUri(u);
}
