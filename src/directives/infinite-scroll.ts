import type { DirectiveBinding, ObjectDirective } from 'vue';

import { InfiniteScrollHandler } from '../hooks/infinite-scroll';

const HandlerSymbol = Symbol('InfiniteScrollHandler');
type InfiniteScrollElement = Element & { [HandlerSymbol]?: InfiniteScrollHandler };
type InfiniteScrollBindingValue = () => void;

export const vInfiniteScroll: ObjectDirective<Element, InfiniteScrollBindingValue> = {
    mounted(el: InfiniteScrollElement, binding: DirectiveBinding<InfiniteScrollBindingValue>) {
        el[HandlerSymbol] = new InfiniteScrollHandler(el, binding.value);
    },

    updated(el: InfiniteScrollElement, binding: DirectiveBinding<InfiniteScrollBindingValue>) {
        el[HandlerSymbol]?.uninstall();
        el[HandlerSymbol] = new InfiniteScrollHandler(el, binding.value);
    },

    unmounted(el: InfiniteScrollElement) {
        el[HandlerSymbol]?.uninstall();
        delete el[HandlerSymbol];
    }
};
