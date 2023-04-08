import { showAlert } from '@/components/alert-helpers';

import { VfOptions } from '../config';

export class UserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserError';
    }
}

export function formatError(err: any): string {
    if (err instanceof UserError) {
        return err.message;
    }

    const errMessage = toError(err).message;
    return `An application error has occurred:\n\n${errMessage}\n\nPlease refresh the page and try again. If this error persists, ${VfOptions.unhandledErrorSupportText}.`;
}

export function toError(err: any) {
    return err instanceof Error ? err : new Error(String(err));
}

export async function handleErrorAndAlert(errIn: any, alertTitle?: string) {
    const err = toError(errIn);

    if (!(err instanceof UserError)) {
        VfOptions.errorHandler(err);
    }

    return alertTitle ? showAlert(alertTitle, err) : showAlert(err);
}
