import type { ObjectDirective } from 'vue';

import { VfOptions } from '@/config';

const ObserverMap = new WeakMap<HTMLElement, ResizeObserver>();

export const vStickyMinWidth: ObjectDirective<HTMLElement, boolean | undefined> = {
    beforeMount(el, binding) {
        if (binding.value === false || VfOptions.disableStickyMinWidthDirective) return;
        setup(el);
    },

    updated(el, binding) {
        if (binding.value !== binding.oldValue) {
            if (binding.value === false || VfOptions.disableStickyMinWidthDirective) {
                teardown(el);
            } else {
                setup(el);
            }
        }
    },

    beforeUnmount(el) {
        teardown(el);
    }
};

function setup(el: HTMLElement) {
    const observer = new ResizeObserver(() => {
        const computedMinWidthStr = window.getComputedStyle(el).minWidth.match(/^(\d+)px$/)?.[1];
        const computedMinWidth = computedMinWidthStr ? parseInt(computedMinWidthStr, 10) : 0;
        if (el.clientWidth <= computedMinWidth) return;
        el.style.minWidth = `${el.clientWidth}px`;
    });
    ObserverMap.set(el, observer);
    observer.observe(el);
}

function teardown(el: HTMLElement) {
    const observer = ObserverMap.get(el);
    if (observer) {
        observer.unobserve(el);
        ObserverMap.delete(el);
    }
}
