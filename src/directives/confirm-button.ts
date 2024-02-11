import type { DirectiveBinding } from 'vue';
import type { ObjectDirective } from 'vue';

interface ConfirmButtonOptions {
    text?: string | null;
    class?: string;
}

export const vConfirmButton: ObjectDirective<HTMLElement, ConfirmButtonOptions> = {
    mounted: fn
};

const ConfirmState = Symbol('ConfirmState');
interface IConfirmState {
    initTime: number;
    preconfirmHtml: string;
    resetHandler: () => void;
}
interface IConfirmElement {
    [ConfirmState]?: IConfirmState;
}

function fn(el: HTMLElement & IConfirmElement, binding: DirectiveBinding<ConfirmButtonOptions>) {
    el.addEventListener('click', e => {
        const now = Date.now();
        const confirmText = binding.value?.text !== undefined ? binding.value.text : 'Confirm';

        if (el[ConfirmState]) {
            if (now - el[ConfirmState].initTime < 300) {
                return;
            }

            el[ConfirmState].resetHandler();
            el.dispatchEvent(new Event('confirm'));
            return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();

        const confirmState: IConfirmState = {
            initTime: now,
            preconfirmHtml: el.innerHTML,
            resetHandler: () => {
                if (confirmText) el.innerHTML = confirmState.preconfirmHtml;
                if (binding.value?.class) el.classList.remove(binding.value.class);
                el.blur();

                el.removeEventListener('mouseout', confirmState.resetHandler);
                delete el[ConfirmState];
            }
        };

        el[ConfirmState] = confirmState;
        if (confirmText) el.innerHTML = confirmText;
        if (binding.value?.class) el.classList.add(binding.value.class);

        el.addEventListener('mouseout', confirmState.resetHandler);
    });
}
