/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    type AllowedComponentProps,
    type Component,
    type ComponentCustomProps,
    type ComponentInternalInstance,
    defineComponent,
    h,
    markRaw,
    type Raw,
    reactive,
    renderList,
    Teleport,
    type VNode,
    type VNodeProps,
    watch
} from 'vue';

import { VfOptions } from '@/config';

import OverlayAnchor from './overlay-anchor.vue';
import type { OverlayAnchorOptions } from './overlay-types';

interface OverlayOptions<C extends Component, R extends ComponentReturn<C>> {
    anchor?: OverlayAnchorOptions;
    onCallback?: (result: R) => void | Promise<boolean>;
}

export interface OverlayInjection<C extends Component> {
    id: string;
    component: Raw<C>;
    props: { callback?: () => void } & OverlayComponentProps<C>;
    options: OverlayOptions<C, any>;
    vnode: VNode;
    wrapperVnode?: VNode;
}

let overlayCount = 0;

const OverlayInjections: OverlayInjection<any>[] = reactive([]);
watch(OverlayInjections, () => {
    VfOptions.onOverlaysChanged?.(OverlayInjections.length);
});

export const OverlayContainer = defineComponent({
    setup() {
        return () =>
            h('div', [
                renderList(OverlayInjections, injection => {
                    return h(Teleport, { key: injection.id, to: '#vf-overlay-target' }, [injection.wrapperVnode ?? injection.vnode]);
                })
            ]);
    }
});

export type AnyComponentPublicInstance = { $?: ComponentInternalInstance };

// Handle both regular and generic components
type ExtractComponentProps<C> = C extends new (...args: any) => any
    ? InstanceType<C>['$props']
    : C extends (props: infer P, ...args: any) => any
      ? P
      : C extends { __props?: infer P }
        ? P
        : never;

// Remove Vue's internal prop types and the Record<string, unknown> index signature
type CleanProps<P> = {
    [K in keyof P as K extends keyof (VNodeProps & AllowedComponentProps & ComponentCustomProps) ? never : string extends K ? never : K]: P[K];
};

type ComponentReturn<C> =
    CleanProps<ExtractComponentProps<C>> extends {
        callback: (result: infer R) => void;
    }
        ? R
        : never;

type OverlayComponentProps<C> = CleanProps<ExtractComponentProps<C>>;

export function createOverlayInjection<C extends Component, R extends ComponentReturn<C>>(
    component: C,
    props: OverlayComponentProps<C>,
    options?: OverlayOptions<C, R>
): OverlayInjection<C> {
    // create or reconfigure the existing overlay target
    // re-injecting every time keeps the overlay container at the very end of the DOM
    const targetEl = document.getElementById('vf-overlay-target') ?? document.createElement('div');
    targetEl.id = 'vf-overlay-target';
    targetEl.removeAttribute('inert');
    document.body.appendChild(targetEl);

    const overlayId = String(++overlayCount);
    const rawComponent = markRaw(component);
    const vnode = h(rawComponent, props);
    const wrapperVnode = options?.anchor ? h(OverlayAnchor, { overlayId, anchor: options.anchor }, () => [vnode]) : undefined;

    // todo: dunno what's going on with types here
    const injection: OverlayInjection<C> = {
        id: overlayId,
        component: rawComponent,
        props,
        options: options ?? {},
        vnode,
        wrapperVnode
    };
    OverlayInjections.push(injection);

    return injection;
}

export function dismissOverlayInjectionByInstance(instance: AnyComponentPublicInstance) {
    if (instance.$) {
        dismissOverlayInjectionByInternalInstance(instance.$);
    }
}

export function dismissOverlayInjectionByInternalInstance(instance: ComponentInternalInstance) {
    let targetInstance: ComponentInternalInstance | null = instance;
    while (targetInstance && !dismissOverlayInjectionByVnode(targetInstance.vnode)) {
        targetInstance = targetInstance.parent;
    }
}

export function dismissOverlayInjectionByVnode(vnode: VNode) {
    const injectionIdx = OverlayInjections.findIndex(i => i.vnode.component === vnode.component);
    if (injectionIdx >= 0) {
        OverlayInjections[injectionIdx]!.props.callback?.();
        return true;
    }
    return false;
}

export function dismissOverlayInjectionById(id: string) {
    const injectionIdx = OverlayInjections.findIndex(i => i.id === id);
    if (injectionIdx >= 0) {
        OverlayInjections[injectionIdx]!.props.callback?.();
        return true;
    }
    return false;
}

export function removeOverlayInjection(injection: OverlayInjection<any>) {
    const index = OverlayInjections.indexOf(injection);
    if (index >= 0) {
        OverlayInjections.splice(index, 1);
    }
}

export async function presentOverlay<C extends Component, R extends ComponentReturn<C>>(
    component: C,
    props: Omit<OverlayComponentProps<C>, 'callback'>,
    options?: OverlayOptions<C, R>
): Promise<R | undefined> {
    return new Promise<R>(resolve => {
        let overlayInjection: OverlayInjection<C> | null = null;
        const callback = async (result: R) => {
            if (options?.onCallback) {
                const hookResult = options.onCallback(result);
                if (typeof hookResult === 'object' && 'then' in hookResult && typeof hookResult.then === 'function') {
                    // ^ hack for ZoneAwarePromise
                    const hookResultValue = await hookResult;
                    if (hookResultValue === false) {
                        return;
                    }
                }
            }

            removeOverlayInjection(overlayInjection!);
            resolve(result);
        };
        const resolvedProps = { ...props, callback } as OverlayComponentProps<C>;
        overlayInjection = createOverlayInjection(component, resolvedProps, options);
    });
}

export async function updateOverlayProps<C extends Component>(
    injection: OverlayInjection<C>,
    props: Partial<Omit<OverlayComponentProps<C>, 'callback'>>
) {
    const targetProps = injection.vnode.component!.props;
    for (const key in props) {
        targetProps[key] = (props as any)[key];
    }
}
