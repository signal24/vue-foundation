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

export class InfiniteScrollHandler {
    private observer: IntersectionObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    private sentinel: HTMLElement | null = null;
    private container: Element | HTMLElement;

    constructor(
        private el: Element,
        private handler: (e: Event) => void
    ) {
        if (this.el === (window as unknown as Element)) {
            this.container = document.body;
        } else {
            this.container = this.el;
        }
        this.install();
    }

    install() {
        if (this.observer) return;

        // Create sentinel
        this.sentinel = document.createElement('div');
        Object.assign(this.sentinel.style, {
            opacity: '0',
            pointerEvents: 'none',
            width: '1px',
            height: '1px'
        });

        this.container.appendChild(this.sentinel);

        // Intersection Observer
        this.observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry && entry.isIntersecting) {
                    this.handler(new CustomEvent('scroll-bottom'));
                }
            },
            {
                root: this.el === (window as unknown as Element) ? null : this.el,
                // Trigger when sentinel is fully visible (or at least 1px)
                threshold: 0.1
            }
        );

        this.observer.observe(this.sentinel);

        // Mutation Observer to keep sentinel at bottom
        this.mutationObserver = new MutationObserver(() => {
            if (!this.sentinel) return;

            // Check if sentinel is the last child
            if (this.container.lastElementChild !== this.sentinel) {
                // Determine if we should move it.
                // If we append it, it moves to the end.
                // Note: appending an element that is already in DOM moves it.
                this.container.appendChild(this.sentinel);
            }
        });

        this.mutationObserver.observe(this.container, {
            childList: true,
            // We only care about direct children for now, unless the list is deeper?
            // Usually infinite scroll list is direct children.
            subtree: false
        });
    }

    uninstall() {
        this.observer?.disconnect();
        this.observer = null;

        this.mutationObserver?.disconnect();
        this.mutationObserver = null;

        if (this.sentinel && this.sentinel.parentNode) {
            this.sentinel.parentNode.removeChild(this.sentinel);
        }
        this.sentinel = null;
    }
}
