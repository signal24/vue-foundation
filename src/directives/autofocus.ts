import type { DirectiveBinding, ObjectDirective } from 'vue';

export const vAutofocus: ObjectDirective<HTMLElement, void> = {
    mounted: fn,
    updated: fn
};

const HasAutoFocused = Symbol('HasAutoFocused');
interface AutoFocusElement {
    [HasAutoFocused]?: boolean;
}

function fn(el: HTMLElement & AutoFocusElement, binding: DirectiveBinding<void>) {
    if (binding.value === undefined && el[HasAutoFocused]) return;
    if (binding.value !== undefined && !binding.value) return;
    if (binding.oldValue !== undefined && binding.value == binding.oldValue) return;
    el[HasAutoFocused] = true;
    const realEl = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].indexOf(el.tagName) > -1 ? el : (el.querySelectorAll('input')[0] as HTMLElement);
    setTimeout(() => realEl.focus(), 10);
}
