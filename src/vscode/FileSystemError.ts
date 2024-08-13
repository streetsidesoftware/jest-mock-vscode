import type * as vscode from 'vscode';

import { isErrorErrnoException } from './isError';
import type { Uri } from './uri';

export function toFileSystemError(uri: Uri, error: NodeJS.ErrnoException | unknown): FileSystemError {
    if (error instanceof FileSystemError) {
        return error; // avoid double conversion
    }

    const code = isErrorErrnoException(error) ? error.code : undefined;

    switch (code) {
        case 'ENOENT':
            return FileSystemError.FileNotFound(uri);
        case 'EISDIR':
            return FileSystemError.FileIsADirectory(uri);
        case 'ENOTDIR':
            return FileSystemError.FileNotADirectory(uri);
        case 'EEXIST':
            return FileSystemError.FileExists(uri);
        case 'EPERM':
        case 'EACCES':
            return FileSystemError.NoPermissions(uri);
        default:
            return FileSystemError.Unknown(uri);
    }
}

export const FileSystemProviderErrorCode = {
    FileExists: 'FileExists',
    FileNotFound: 'FileNotFound',
    FileNotADirectory: 'FileNotADirectory',
    FileIsADirectory: 'FileIsADirectory',
    FileExceedsMemoryLimit: 'FileExceedsMemoryLimit',
    FileTooLarge: 'FileTooLarge',
    FileWriteLocked: 'FileWriteLocked',
    NoPermissions: 'NoPermissions',
    Unavailable: 'Unavailable',
    Unknown: 'Unknown',
} as const;

/**
 * A type that filesystem providers should use to signal errors.
 *
 * This class has factory methods for common error-cases, like `FileNotFound` when
 * a file or folder doesn't exist, use them like so: `throw vscode.FileSystemError.FileNotFound(someUri);`
 */
export class FileSystemError extends Error implements vscode.FileSystemError {
    /**
     * Create an error to signal that a file or folder wasn't found.
     * @param messageOrUri Message or uri.
     */
    static FileNotFound(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotFound);
    }

    /**
     * Create an error to signal that a file or folder already exists, e.g. when
     * creating but not overwriting a file.
     * @param messageOrUri Message or uri.
     */
    static FileExists(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileExists);
    }

    /**
     * Create an error to signal that a file is not a folder.
     * @param messageOrUri Message or uri.
     */
    static FileNotADirectory(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotADirectory);
    }

    /**
     * Create an error to signal that a file is a folder.
     * @param messageOrUri Message or uri.
     */
    static FileIsADirectory(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileIsADirectory);
    }

    /**
     * Create an error to signal that an operation lacks required permissions.
     * @param messageOrUri Message or uri.
     */
    static NoPermissions(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.NoPermissions);
    }

    /**
     * Create an error to signal that the file system is unavailable or too busy to
     * complete a request.
     * @param messageOrUri Message or uri.
     */
    static Unavailable(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.Unavailable);
    }

    /**
     * Create an error to signal that the file system is unavailable or too busy to
     * complete a request.
     * @param messageOrUri Message or uri.
     */
    static Unknown(messageOrUri?: string | Uri): FileSystemError {
        return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.Unknown);
    }

    /**
     * Creates a new filesystem error.
     *
     * @param messageOrUri Message or uri.
     */
    constructor(
        readonly messageOrUri?: string | Uri,
        code?: string,
    ) {
        const msg = typeof messageOrUri === 'string' ? messageOrUri : messageOrUri?.toString();
        super(msg);
        this.code = code || FileSystemProviderErrorCode.Unknown;
    }

    /**
     * A code that identifies this error.
     *
     * Possible values are names of errors, like {@linkcode FileSystemError.FileNotFound FileNotFound},
     * or `Unknown` for unspecified errors.
     */
    readonly code: string;
}
