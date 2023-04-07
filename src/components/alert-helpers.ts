import AlertModal from './alert-modal.vue';
import { createModalInjection, presentModal, removeModalInjection } from './modal-container';

function resolveAlertParams(titleOrMessage: string | Error, message?: string | Error) {
    const title = message ? (titleOrMessage as string) : undefined;
    const resolvedMessage = message ?? titleOrMessage;
    return { title, message: resolvedMessage };
}

export async function showAlert(title: string, message: string | Error): Promise<void>;
export async function showAlert(message: string | Error): Promise<void>;
export async function showAlert(titleOrMessage: string | Error, message?: string | Error): Promise<void> {
    await presentModal(AlertModal, resolveAlertParams(titleOrMessage, message));
}

export async function showConfirm(title: string, message: string): Promise<boolean>;
export async function showConfirm(message: string): Promise<boolean>;
export async function showConfirm(titleOrMessage: string, message?: string): Promise<boolean> {
    return presentModal(AlertModal, {
        ...resolveAlertParams(titleOrMessage, message),
        shouldConfirm: true
    });
}

export async function showConfirmDestroy(title: string, message: string): Promise<boolean>;
export async function showConfirmDestroy(message: string): Promise<boolean>;
export async function showConfirmDestroy(titleOrMessage: string, message?: string): Promise<boolean> {
    return presentModal(AlertModal, {
        ...resolveAlertParams(titleOrMessage, message),
        shouldConfirm: true,
        classes: ['destructive']
    });
}

export function showWait(title: string, message: string): () => void;
export function showWait(message: string): () => void;
export function showWait(titleOrMessage: string, message?: string): () => void {
    const injection = createModalInjection(AlertModal, {
        ...resolveAlertParams(titleOrMessage, message),
        callback: () => {}
    });
    return () => removeModalInjection(injection);
}
