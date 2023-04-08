import {
    type ComponentInternalInstance,
    type ComponentOptionsMixin,
    type ComponentPropsOptions,
    type ComponentPublicInstance,
    type ComputedOptions,
    type DefineComponent,
    defineComponent,
    type ExtractPropTypes,
    h,
    markRaw,
    type MethodOptions,
    type Raw,
    reactive,
    renderList,
    type VNode
} from 'vue';

import type { Branded, UnwrapBrand } from '../types';

interface ModalInjection<C extends AnyComponent> {
    id: string;
    component: Raw<C>;
    props: ComponentProps<C>;
    vnode: VNode;
}

let modalCount = 0;
const ModalInjections: ModalInjection<any>[] = reactive([]);

export const ModalContainer = defineComponent({
    setup() {
        return () =>
            h('div', { id: 'modal-container' }, [
                renderList(ModalInjections, injection => {
                    console.log('sending vnote', injection.vnode);
                    return injection.vnode;
                })
            ]);
    },

    watch: {
        ModalInjections() {
            console.log('mi changed', ModalInjections);
        }
    }
});

const _InputBrand = typeof Symbol('ModalInput');
type InputBrand = typeof _InputBrand;
export type ModalInput<T> = Branded<InputBrand, T>;

export type AnyComponent<
    A = any,
    B = any,
    C = any,
    D extends ComputedOptions = any,
    E extends MethodOptions = any,
    F extends ComponentOptionsMixin = any,
    G extends ComponentOptionsMixin = any
> = DefineComponent<A, B, C, D, E, F, G>;

export type UnwrapPropsVueInternal<PropsOrPropOptions> = PropsOrPropOptions extends ComponentPropsOptions
    ? ExtractPropTypes<PropsOrPropOptions>
    : PropsOrPropOptions;

// this wasn't necessary at first but suddenly "props" is showing as the type, so adding it for now
type UnwrapIntermittentPropsObject<T> = T extends { props: Readonly<infer P> } ? P : T;
type ExtractModalInputProps_<T> = UnwrapBrand<T, InputBrand>;
type ExtractModalInputProps<T> = ExtractModalInputProps_<UnwrapIntermittentPropsObject<T>>;

type CallbackObject<T> = { callback: T };
type CallbackProps<T> = T extends CallbackObject<infer R> ? { callback: R } : {};

type ExtractProps<T> = CallbackProps<T> & ExtractModalInputProps<T>;
type ComponentProps_<P, R> = ExtractProps<UnwrapPropsVueInternal<P>> & ExtractProps<R>;
type ComponentProps<C> = C extends AnyComponent<infer P, infer R> ? ComponentProps_<P, R> : never;

interface PropsWithCallback<T> {
    callback?: (result: T) => void;
}
type ComponentReturn<C> = ComponentProps<C> extends PropsWithCallback<infer R> ? R : never;

export function createModalInjection<C extends AnyComponent>(component: C, props: ComponentProps<C>): ModalInjection<C> {
    // create or reconfigure the existing modal target
    // re-injecting every time keeps the modal container at the very end of the DOM
    const targetEl = document.getElementById('vf-modal-target') ?? document.createElement('div');
    targetEl.id = 'vf-modal-target';
    targetEl.removeAttribute('inert');
    document.body.appendChild(targetEl);

    const rawComponent = markRaw(component as DefineComponent);

    // todo: dunno what's going on with types here
    const injection: ModalInjection<C> = {
        id: String(++modalCount),
        component: rawComponent as any,
        props,
        vnode: h(rawComponent, props)
    };
    ModalInjections.push(injection);

    return injection;
}

export function removeModalInjection(injection: ModalInjection<any>) {
    const index = ModalInjections.indexOf(injection);
    if (index >= 0) {
        ModalInjections.splice(index, 1);
    }
}

export function removeModalInjectionByInstance(instance: ComponentPublicInstance) {
    console.log('closing public', instance);
    removeModalInjectionByInternalInstance(instance.$);
}

export function removeModalInjectionByInternalInstance(instance: ComponentInternalInstance) {
    console.log('closing internal', instance);
    removeModalInjectionByVnode(instance.vnode);
}

export function removeModalInjectionByVnode(vnode: VNode) {
    const injectionIdx = ModalInjections.findIndex(i => i.vnode === vnode);
    if (injectionIdx >= 0) {
        ModalInjections.splice(injectionIdx, 1);
    }
}

export async function presentModal<C extends AnyComponent, R extends ComponentReturn<C>>(
    component: C,
    props: Omit<ComponentProps<C>, 'callback'>
): Promise<R> {
    return new Promise<R>(resolve => {
        let modalInjection: ModalInjection<C> | null = null;
        const callback = (result: R) => {
            removeModalInjection(modalInjection!);
            resolve(result);
        };
        const resolvedProps = { ...props, callback } as ComponentProps<C>;
        modalInjection = createModalInjection(component, resolvedProps);
    });
}
