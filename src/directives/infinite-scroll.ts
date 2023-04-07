import type { DirectiveBinding, ObjectDirective } from 'vue';

import { InfiniteScrollHandler } from '../hooks/infinite-scroll';

const InfiniteScrollState = Symbol('InfiniteScrollState');
interface IInfiniteScrollState {
    [InfiniteScrollState]?: InfiniteScrollHandler;
}
type InfiniteScrollElement = HTMLElement & IInfiniteScrollState;

export const vInfiniteScroll: ObjectDirective<InfiniteScrollElement, () => void> = {
    beforeMount(el: InfiniteScrollElement, binding: DirectiveBinding<() => void>) {
        if (binding.value) {
            const hook = new InfiniteScrollHandler(el, binding.value);
            hook.install();

            el[InfiniteScrollState] = hook;
        }
    },

    unmounted(el: InfiniteScrollElement) {
        if (el[InfiniteScrollState]) {
            el[InfiniteScrollState].uninstall();
            delete el[InfiniteScrollState];
        }
    }
};
