import { showAlert } from '../components/alert-helpers';
import { VfOptions } from '../config';

export class UserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserError';
    }
}

interface ErrorWithCause extends Error {
    cause?: Error;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(err: any): string {
    if (err instanceof UserError) {
        return err.message;
    }

    err = toError(err);
    const errMessage = err.message || String(err);
    return `An application error has occurred:\n\n${errMessage}\n\nPlease refresh the page and try again. If this error persists, ${VfOptions.unhandledErrorSupportText}.`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toError(err: any, cause?: any): ErrorWithCause {
    const error = (isError(err) ? err : new Error(String(err))) as ErrorWithCause;
    if (cause) {
        error.cause = toError(cause);
    }
    return error;
}

export function isError(err: unknown): err is Error {
    if (err instanceof Error) return true;
    if (typeof err === 'object' && err !== null && 'message' in err && 'name' in err) return true;
    return false;
}

interface IErrorAlertOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cause?: any;
    title?: string;
    classes?: string[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleErrorAndAlert(errIn: any, options?: IErrorAlertOptions) {
    const err = toError(errIn, options?.cause);

    if (!(err instanceof UserError)) {
        VfOptions.errorHandler(err);
    }

    return showAlert({
        title: options?.title,
        message: err,
        classes: options?.classes
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleError(errIn: any, cause?: any) {
    const err = toError(errIn, cause);

    if (!(err instanceof UserError)) {
        VfOptions.errorHandler(err);
    }
}
