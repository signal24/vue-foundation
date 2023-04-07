import type { ObjectDirective } from 'vue';

export const vConfirmButton: ObjectDirective<HTMLElement, void> = {
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

function fn(el: HTMLElement & IConfirmElement) {
    el.addEventListener('click', e => {
        const now = Date.now();

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
                el.innerHTML = confirmState.preconfirmHtml;
                el.blur();

                el.removeEventListener('mouseout', confirmState.resetHandler);
                delete el[ConfirmState];
            }
        };
        el[ConfirmState] = confirmState;
        el.innerHTML = 'Confirm';

        el.addEventListener('mouseout', confirmState.resetHandler);
    });
}
