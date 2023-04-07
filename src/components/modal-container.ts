import {
    type ComponentOptionsMixin,
    type ComponentPropsOptions,
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
        return () => h('div', { id: 'modal-container' }, [renderList(ModalInjections, injection => injection.vnode)]);
    }
});

type AnyComponent<
    A = any,
    B = any,
    C = any,
    D extends ComputedOptions = any,
    E extends MethodOptions = any,
    F extends ComponentOptionsMixin = any,
    G extends ComponentOptionsMixin = any
> = DefineComponent<A, B, C, D, E, F, G>;

type UnwrapProps<PropsOrPropOptions> = PropsOrPropOptions extends ComponentPropsOptions ? ExtractPropTypes<PropsOrPropOptions> : PropsOrPropOptions;
type UnwrappedRawProps<T> = { [K in keyof T]: K extends 'callback' ? T[K] : T[K] extends ModalInput<infer R> ? R : never };
type WithoutNever<T> = { [P in keyof T as T[P] extends never ? never : P]: T[P] };
type CleanedUnwrappedRawProps<T> = WithoutNever<UnwrappedRawProps<T>>;
type ComponentProps<C> = C extends AnyComponent<infer P, infer R> ? UnwrapProps<P> & CleanedUnwrappedRawProps<R> : never;

export type ModalInput<T> = T & { __modalInput?: true };

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
    return {
        id: String(++modalCount),
        component: rawComponent as any,
        props,
        vnode: h(rawComponent, props)
    };
}

export function removeModalInjection(injection: ModalInjection<any>) {
    const index = ModalInjections.indexOf(injection);
    if (index >= 0) {
        ModalInjections.splice(index, 1);
    }
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
