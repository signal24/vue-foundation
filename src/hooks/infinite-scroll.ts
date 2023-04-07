import { type ComponentInternalInstance, getCurrentInstance, onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue';

const HookState = Symbol('HookState');
interface IHookState {
    el?: InfiniteScrollHandler;
    ancestor?: InfiniteScrollHandler;
    window?: InfiniteScrollHandler;
}
type InfniteScrollComponent = ComponentInternalInstance & { [HookState]?: IHookState };

interface IOptions {
    elScrolledToBottom?: () => void;
    ancestorScrolledToBottom?: () => void;
    windowScrolledToBottom?: () => void;
}

export function useInfiniteScroll(options: IOptions) {
    const instance = getCurrentInstance()!;
    onMounted(() => installScrollHook(instance, options));
    onActivated(() => reinstallScrollHook(instance));
    onDeactivated(() => uninstallScrollHook(instance));
    onBeforeUnmount(() => uninstallScrollHook(instance));
}

function installScrollHook(cmp: InfniteScrollComponent, options: IOptions) {
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

function reinstallScrollHook(cmp: InfniteScrollComponent) {
    const hookState = cmp[HookState];
    hookState?.el?.install();
    hookState?.ancestor?.install();
    hookState?.window?.install();
}

function uninstallScrollHook(cmp: InfniteScrollComponent) {
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
        this.el.addEventListener('scroll', this.onScroll);
    }

    uninstall() {
        this.el.removeEventListener('scroll', this.onScroll);
    }

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
