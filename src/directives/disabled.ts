import type { DirectiveBinding, ObjectDirective } from 'vue';

export const vDisabled: ObjectDirective<HTMLElement, boolean> = {
    beforeMount: fn,
    updated: fn,
    unmounted
};

function fn(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (el.tagName === 'LABEL') {
        if (binding.value) {
            el.classList.remove('disabled');
        } else {
            el.classList.add('disabled');
        }
        el = el.querySelector('input')!;
    }

    if (binding.value) el.setAttribute('disabled', 'disabled');
    else el.removeAttribute('disabled');
}

function unmounted(el: HTMLElement) {
    if (el.tagName === 'LABEL') {
        el.classList.remove('disabled');
        el = el.querySelector('input')!;
    }

    el.removeAttribute('disabled');
}
