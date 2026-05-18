import type { ObjectDirective } from 'vue';

import { VfOptions } from '@/config';

interface StickyState {
    observer: ResizeObserver;
    onWindowResize: () => void;
}

const StateMap = new WeakMap<HTMLElement, StickyState>();

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
    const onWindowResize = () => {
        el.style.minWidth = '';
    };
    StateMap.set(el, { observer, onWindowResize });
    observer.observe(el);
    window.addEventListener('resize', onWindowResize);
}

function teardown(el: HTMLElement) {
    const state = StateMap.get(el);
    if (state) {
        state.observer.unobserve(el);
        window.removeEventListener('resize', state.onWindowResize);
        StateMap.delete(el);
    }
}
