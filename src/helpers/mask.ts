import type { AnyComponentPublicInstance } from '../components/modal-container';

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

export function maskComponent(cmp: AnyComponentPublicInstance, message?: string) {
    const el = cmp.$.vnode.el;
    const modalParentlEl = el!.closest('.vf-modal');
    return maskEl(modalParentlEl ?? el, message);
}

export function unmaskComponent(cmp: AnyComponentPublicInstance) {
    const el = cmp.$.vnode.el;
    const modalParentlEl = el!.closest('.vf-modal');
    return unmaskEl(modalParentlEl ?? el);
}

export function maskEl(el: MaskElement, message?: string) {
    if (!el[MaskState]) {
        const maskEl = document.createElement('div');
        maskEl.classList.add('vf-mask');
        el.appendChild(maskEl);
        el[MaskState] = { maskEl };
    }

    el[MaskState].maskEl.innerText = message ?? '';

    // todo: add inner HTML to config

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
        buttonHtml: string;
    };
}
type FormMaskElement = Element & IFormMaskState;

export function maskForm(formOrCmp: Element | AnyComponentPublicInstance, buttonSelector?: string | Element, buttonText?: string) {
    const form = formOrCmp instanceof Element ? formOrCmp : getFormFromCmp(formOrCmp);
    form.classList.add('vf-masked');

    const buttonEl = (
        buttonSelector instanceof Element ? buttonSelector : form.querySelectorAll(buttonSelector ?? 'button:not([disabled])')[0]
    ) as HTMLElement;
    const originalButtonHtml = buttonEl.tagName === 'INPUT' ? (buttonEl as HTMLInputElement).value : buttonEl.innerHTML;
    buttonEl.setAttribute('disabled', 'disabled');
    buttonEl.innerText = buttonText ?? 'Please wait...';

    const inputsQR = form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
    const inputs = [...inputsQR] as HTMLElement[];
    inputs.forEach(el => el.setAttribute('disabled', 'disabled'));

    (form as FormMaskElement)[FormMaskState] = {
        disabledElements: inputs,
        waitButton: buttonEl,
        buttonHtml: originalButtonHtml
    };

    return () => unmaskForm(form);
}

export function unmaskForm(formOrCmp: Element | AnyComponentPublicInstance) {
    const form = formOrCmp instanceof Element ? formOrCmp : getFormFromCmp(formOrCmp);

    const state = (form as FormMaskElement)[FormMaskState];
    if (!state) return;

    form.classList.remove('vf-masked');

    state.disabledElements.forEach(el => el.removeAttribute('disabled'));
    state.waitButton.innerHTML = state.buttonHtml;
    state.waitButton.removeAttribute('disabled');

    delete (form as FormMaskElement)[FormMaskState];
}

function getFormFromCmp(cmp: AnyComponentPublicInstance) {
    const cmpEl = cmp.$.vnode.el!;
    if (cmpEl.tagName === 'FORM') {
        return cmpEl as HTMLElement;
    } else {
        return cmpEl.querySelector('form') as HTMLElement;
    }
}
