import type { Writable } from 'type-fest';
import {
    type AllowedComponentProps,
    type ComponentInternalInstance,
    type ComponentPublicInstance,
    type ComputedOptions,
    defineComponent,
    h,
    markRaw,
    type MethodOptions,
    type Raw,
    reactive,
    renderList,
    type VNode,
    type VNodeProps
} from 'vue';

interface ModalInjection<C extends Vue__ComponentPublicInstanceConstructor> {
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

// copied in from Vue since it's not exported
export type Vue__ComponentPublicInstanceConstructor<
    T extends ComponentPublicInstance<Props, RawBindings, D, C, M> = ComponentPublicInstance<any>,
    Props = any,
    RawBindings = any,
    D = any,
    C extends ComputedOptions = ComputedOptions,
    M extends MethodOptions = MethodOptions
> = {
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
    new (...args: any[]): T;
};

export type ComponentConfig<T extends Vue__ComponentPublicInstanceConstructor> = T extends Vue__ComponentPublicInstanceConstructor<infer P>
    ? P
    : never;
export type ComponentProps<T extends Vue__ComponentPublicInstanceConstructor> = Writable<
    Omit<ComponentConfig<T>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
>;

interface PropsWithCallback<T> {
    callback?: (result: T) => void;
}
type ComponentReturn<C extends Vue__ComponentPublicInstanceConstructor> = ComponentProps<C> extends PropsWithCallback<infer R> ? R : never;

export function createModalInjection<C extends Vue__ComponentPublicInstanceConstructor>(component: C, props: ComponentProps<C>): ModalInjection<C> {
    // create or reconfigure the existing modal target
    // re-injecting every time keeps the modal container at the very end of the DOM
    const targetEl = document.getElementById('vf-modal-target') ?? document.createElement('div');
    targetEl.id = 'vf-modal-target';
    targetEl.removeAttribute('inert');
    document.body.appendChild(targetEl);

    const rawComponent = markRaw(component);

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

export function removeModalInjectionByInstance(instance: ComponentPublicInstance<any, any, any, any, any, any, any, any>) {
    removeModalInjectionByInternalInstance(instance.$);
}

export function removeModalInjectionByInternalInstance(instance: ComponentInternalInstance) {
    let targetInstance: ComponentInternalInstance | null = instance;
    while (targetInstance && !removeModalInjectionByVnode(targetInstance.vnode)) {
        targetInstance = targetInstance.parent;
    }
}

export function removeModalInjectionByVnode(vnode: VNode) {
    const injectionIdx = ModalInjections.findIndex(i => i.vnode === vnode);
    if (injectionIdx >= 0) {
        ModalInjections[injectionIdx].props.callback?.(undefined);
        ModalInjections.splice(injectionIdx, 1);
        return true;
    }
    return false;
}

export async function presentModal<C extends Vue__ComponentPublicInstanceConstructor, R extends ComponentReturn<C>>(
    component: C,
    props: Omit<ComponentProps<C>, 'callback'>
): Promise<R | undefined> {
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
