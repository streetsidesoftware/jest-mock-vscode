import assert from 'assert';

export function isError(error: unknown): error is Error {
    if (!error || typeof error !== 'object' || Array.isArray(error)) return false;
    const e = error as Error;
    return typeof e.message === 'string';
}
export function isErrorErrnoException(error: unknown): error is NodeJS.ErrnoException {
    if (!error || typeof error !== 'object' || Array.isArray(error)) return false;
    const e = error as NodeJS.ErrnoException;
    return typeof e.message === 'string' && typeof e.code === 'string';
}

export function toErrorErrnoException(error: unknown): NodeJS.ErrnoException {
    assert(isErrorErrnoException(error));
    return error;
}
