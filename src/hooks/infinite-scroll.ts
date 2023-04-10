import { type ComponentInternalInstance, getCurrentInstance, onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue';

const HookState = Symbol('HookState');
interface IHookState {
    el?: InfiniteScrollHandler;
    ancestor?: InfiniteScrollHandler;
    window?: InfiniteScrollHandler;
}
type InfiniteScrollComponent = ComponentInternalInstance & { [HookState]?: IHookState };

export interface IInfiniteScrollOptions {
    elScrolledToBottom?: () => void;
    ancestorScrolledToBottom?: () => void;
    windowScrolledToBottom?: () => void;
}

export function useInfiniteScroll(options: IInfiniteScrollOptions, instance?: ComponentInternalInstance) {
    const resolvedInstance = instance ?? getCurrentInstance()!;
    onMounted(() => installScrollHook(resolvedInstance, options), resolvedInstance);
    onActivated(() => reinstallScrollHook(resolvedInstance), resolvedInstance);
    onDeactivated(() => uninstallScrollHook(resolvedInstance), resolvedInstance);
    onBeforeUnmount(() => uninstallScrollHook(resolvedInstance), resolvedInstance);
}

export function installScrollHook(cmp: InfiniteScrollComponent, options: IInfiniteScrollOptions) {
    const hookState: IHookState = {};

    if (options.elScrolledToBottom) {
        hookState.el = new InfiniteScrollHandler(cmp.vnode.el as Element, options.elScrolledToBottom);
        hookState.el.install();
    }

    if (options.ancestorScrolledToBottom) {
        const scrollableAncestorEl = discoverScrollableAncestorEl(cmp.vnode.el as Element);
        if (scrollableAncestorEl) {
            hookState.ancestor = new InfiniteScrollHandler(scrollableAncestorEl, options.ancestorScrolledToBottom);
            hookState.ancestor.install();
        } else {
            console.warn('no scollable ancestor found for component:', cmp);
        }
    }

    if (options.windowScrolledToBottom) {
        hookState.window = new InfiniteScrollHandler(window as unknown as Element, options.windowScrolledToBottom);
        hookState.window.install();
    }

    cmp[HookState] = hookState;
}

export function reinstallScrollHook(cmp: InfiniteScrollComponent) {
    const hookState = cmp[HookState];
    hookState?.el?.install();
    hookState?.ancestor?.install();
    hookState?.window?.install();
}

export function uninstallScrollHook(cmp: InfiniteScrollComponent) {
    const hookState = cmp[HookState];
    hookState?.el?.uninstall();
    hookState?.ancestor?.uninstall();
    hookState?.window?.uninstall();
}

const ScrollableOverflowValues = ['auto', 'scroll'];
function discoverScrollableAncestorEl(el: Element): Element | null {
    const parent = el.parentElement;
    if (!parent) return null;

    const computedStyle = window.getComputedStyle(parent);
    if (
        ScrollableOverflowValues.includes(computedStyle.overflow) ||
        ScrollableOverflowValues.includes(computedStyle.overflowX) ||
        ScrollableOverflowValues.includes(computedStyle.overflowY)
    ) {
        return parent;
    }

    return discoverScrollableAncestorEl(parent);
}

// TODO: switch to intersection observer
export class InfiniteScrollHandler {
    isTripped = false;

    constructor(private el: Element, private handler: (e: Event) => void) {}

    install() {
        this.el.addEventListener('scroll', this.onScrollWithContext);
    }

    uninstall() {
        this.el.removeEventListener('scroll', this.onScrollWithContext);
    }

    onScrollWithContext = this.onScroll.bind(this);
    onScroll(e: Event) {
        if (Math.ceil(this.el.scrollTop + this.el.clientHeight + 5) >= this.el.scrollHeight) {
            if (!this.isTripped) {
                this.handler(e);
                this.isTripped = true;
            }
        } else if (this.isTripped) {
            this.isTripped = false;
        }
    }
}
