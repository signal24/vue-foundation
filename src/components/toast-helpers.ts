import { createOverlayInjection, removeOverlayInjection } from './overlay-container';
import Toast, { type IToastOptions } from './toast.vue';

export function showToast(options: IToastOptions) {
    const injection = createOverlayInjection(Toast, {
        ...options,
        callback: () => {}
    });
    return () => removeOverlayInjection(injection);
}
