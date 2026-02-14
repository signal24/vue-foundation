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
    }

    if (options.ancestorScrolledToBottom) {
        const scrollableAncestorEl = discoverScrollableAncestorEl(cmp.vnode.el as Element);
        if (scrollableAncestorEl) {
            hookState.ancestor = new InfiniteScrollHandler(scrollableAncestorEl, options.ancestorScrolledToBottom);
        } else {
            console.warn('[VueFoundation] No scollable ancestor found for component:', cmp);
        }
    }

    if (options.windowScrolledToBottom) {
        hookState.window = new InfiniteScrollHandler(window as unknown as Element, options.windowScrolledToBottom);
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

let scrollableAncestorCache = new WeakMap<Element, Element | null>();
let isScrollableCache = new WeakMap<Element, boolean>();
let cacheInvalidationScheduled = false;

function ensureCache() {
    if (!cacheInvalidationScheduled) {
        setTimeout(() => {
            scrollableAncestorCache = new WeakMap();
            isScrollableCache = new WeakMap();
            cacheInvalidationScheduled = false;
        }, 0);
        cacheInvalidationScheduled = true;
    }
}

export function discoverScrollableAncestorEl(el: Element): Element | null {
    ensureCache();

    if (scrollableAncestorCache.has(el)) {
        return scrollableAncestorCache.get(el) ?? null;
    }

    const parent = el.parentElement;
    if (!parent) {
        scrollableAncestorCache.set(el, null);
        return null;
    }

    let isParentScrollable = isScrollableCache.get(parent);
    if (isParentScrollable === undefined) {
        const computedStyle = window.getComputedStyle(parent);
        isParentScrollable =
            ScrollableOverflowValues.includes(computedStyle.overflow) ||
            ScrollableOverflowValues.includes(computedStyle.overflowX) ||
            ScrollableOverflowValues.includes(computedStyle.overflowY);
        isScrollableCache.set(parent, isParentScrollable);
    }

    if (isParentScrollable) {
        scrollableAncestorCache.set(el, parent);
        return parent;
    }

    const ancestor = discoverScrollableAncestorEl(parent);
    scrollableAncestorCache.set(el, ancestor);
    return ancestor;
}

export class InfiniteScrollHandler {
    private observer: IntersectionObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    private sentinel: HTMLElement | null = null;
    private container: Element | HTMLElement;
    private isTripped = false;

    constructor(
        private el: Element,
        private handler: (e: Event) => void
    ) {
        this.container = this.el === (window as unknown as Element) ? document.body : this.el;
        this.install();
    }

    install() {
        if (this.observer) return;

        this.sentinel = document.createElement('div');
        Object.assign(this.sentinel.style, {
            height: '1px',
            width: '100%',
            pointerEvents: 'none',
            visibility: 'hidden'
        });

        this.container.appendChild(this.sentinel);

        this.observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry && entry.isIntersecting) {
                    if (!this.isTripped) {
                        this.handler(new CustomEvent('scroll-bottom'));
                        this.isTripped = true;
                    }
                } else {
                    this.isTripped = false;
                }
            },
            {
                root: this.el === (window as unknown as Element) ? null : this.el,
                threshold: 0.1
            }
        );

        this.observer.observe(this.sentinel);

        this.mutationObserver = new MutationObserver(() => {
            if (this.sentinel && this.container.lastElementChild !== this.sentinel) {
                this.container.appendChild(this.sentinel);
            }
        });

        this.mutationObserver.observe(this.container, { childList: true });
    }

    uninstall() {
        this.observer?.disconnect();
        this.observer = null;

        this.mutationObserver?.disconnect();
        this.mutationObserver = null;

        if (this.sentinel?.parentNode) {
            this.sentinel.parentNode.removeChild(this.sentinel);
        }
        this.sentinel = null;
    }
}
