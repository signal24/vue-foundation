import type { ComponentInternalInstance } from 'vue';

/*///////////////////////////////////////////////
Component Overlay Masking
//////////////////////////////////////////////*/
const MaskState = Symbol('MaskState');
interface IMaskState {
    [MaskState]?: {
        maskEl: HTMLElement;
    };
}
type MaskElement = Element & IMaskState;

export function maskComponent(cmp: ComponentInternalInstance, message: string) {
    const el = cmp.vnode.el;
    const modalParentlEl = el!.closest('.vf-modal');
    return maskEl(modalParentlEl ?? el, message);
}

export function unmaskComponent(cmp: ComponentInternalInstance) {
    const el = cmp.vnode.el;
    const modalParentlEl = el!.closest('.vf-modal');
    return unmaskEl(modalParentlEl ?? el);
}

export function maskEl(el: MaskElement, message: string) {
    if (!el[MaskState]) {
        const maskEl = document.createElement('div');
        maskEl.classList.add('vf-mask');
        el.appendChild(maskEl);
        el[MaskState] = { maskEl };
    }

    el[MaskState].maskEl.innerText = message;

    return () => unmaskEl(el);
}

export function unmaskEl(el: MaskElement) {
    if (!el[MaskState]) return;
    el.removeChild(el[MaskState].maskEl);
}

/*///////////////////////////////////////////////
Form Masking
//////////////////////////////////////////////*/
const FormMaskState = Symbol('FormMaskState');
interface IFormMaskState {
    [FormMaskState]?: {
        disabledElements: HTMLElement[];
        waitButton: HTMLElement;
        buttonText: string;
    };
}
type FormMaskElement = Element & IFormMaskState;

export function maskForm(formOrCmp: Element | ComponentInternalInstance, buttonSelector?: string | Element, buttonText?: string) {
    const form = formOrCmp instanceof Element ? formOrCmp : getFormFromCmp(formOrCmp);
    form.classList.add('vf-masked');

    const buttonEl = (
        buttonSelector instanceof Element ? buttonSelector : form.querySelector(buttonSelector ?? 'button:not([disabled]):first')
    ) as HTMLElement;
    const originalButtonText = buttonEl.tagName === 'INPUT' ? (buttonEl as HTMLInputElement).value : buttonEl.innerText;
    buttonEl.setAttribute('disabled', 'disabled');
    buttonEl.innerText = buttonText ?? 'Please wait...';

    const inputsQR = form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
    const inputs = [...inputsQR] as HTMLElement[];
    inputs.forEach(el => el.setAttribute('disabled', 'disabled'));

    (form as FormMaskElement)[FormMaskState] = {
        disabledElements: inputs,
        waitButton: buttonEl,
        buttonText: originalButtonText
    };

    return () => unmaskForm(form);
}

export function unmaskForm(formOrCmp: Element | ComponentInternalInstance) {
    const form = formOrCmp instanceof Element ? formOrCmp : getFormFromCmp(formOrCmp);

    const state = (form as FormMaskElement)[FormMaskState];
    if (!state) return;

    form.classList.remove('vf-masked');

    state.disabledElements.forEach(el => el.removeAttribute('disabled'));
    state.waitButton.innerText = state.buttonText;
    state.waitButton.removeAttribute('disabled');

    delete (form as FormMaskElement)[FormMaskState];
}

function getFormFromCmp(cmp: ComponentInternalInstance) {
    const cmpEl = cmp.vnode.el!;
    if (cmpEl.tagName === 'FORM') {
        return cmpEl as HTMLElement;
    } else {
        return cmpEl.querySelector('form') as HTMLElement;
    }
}
