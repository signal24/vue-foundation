import type { ObjectDirective } from 'vue';

const ObserverMap = new WeakMap<HTMLElement, ResizeObserver>();

export const vStickyMinWidth: ObjectDirective<HTMLElement> = {
    beforeMount(el) {
        const observer = new ResizeObserver(() => {
            const computedMinWidthStr = window.getComputedStyle(el).minWidth.match(/^(\d+)px$/)?.[1];
            const computedMinWidth = computedMinWidthStr ? parseInt(computedMinWidthStr, 10) : 0;
            if (el.clientWidth <= computedMinWidth) return;
            el.style.minWidth = `${el.clientWidth}px`;
        });
        ObserverMap.set(el, observer);
        observer.observe(el);
    },

    beforeUnmount(el) {
        const observer = ObserverMap.get(el);
        if (observer) {
            observer.unobserve(el);
            ObserverMap.delete(el);
        }
    }
};
