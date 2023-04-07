import type { DirectiveBinding, ObjectDirective } from 'vue';

export const vReadonly: ObjectDirective<HTMLElement, boolean> = {
    beforeMount: fn,
    updated: fn
};

function fn(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (el.tagName == 'LABEL') {
        el = el.querySelector('input')!;
    }

    if (binding.value) el.setAttribute('readonly', 'readonly');
    else el.removeAttribute('readonly');
}
