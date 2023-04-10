import type { DirectiveBinding, ObjectDirective } from 'vue';

import { type IInfiniteScrollOptions, useInfiniteScroll } from '../hooks/infinite-scroll';

export const vInfiniteScroll: ObjectDirective<Element, IInfiniteScrollOptions> = {
    created(_el: Element, binding: DirectiveBinding<IInfiniteScrollOptions>) {
        useInfiniteScroll(binding.value, binding.instance!.$);
    }
};
