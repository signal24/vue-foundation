import type { ObjectDirective } from 'vue';

const ObserverMap = new WeakMap<HTMLElement, ResizeObserver>();

export const vStickyMinWidth: ObjectDirective<HTMLElement> = {
    beforeMount(el) {
        const observer = new ResizeObserver(() => {
            const minWidth = el.clientWidth;
            el.style.minWidth = `${minWidth}px`;
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
