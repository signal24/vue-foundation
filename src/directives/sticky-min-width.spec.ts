import { afterEach, describe, expect, it, vi } from 'vitest';

import { vStickyMinWidth } from './sticky-min-width';

// We need to mock ResizeObserver
class MockResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe(target: Element) {
        // Trigger callback immediately or when resize happens
        // For testing, we can expose a method to trigger it?
        // Or we can mock the global class and capture instances.
        (MockResizeObserver as any).instances.push(this);
        (MockResizeObserver as any).observations.push(target);
    }
    unobserve(target: Element) {
        // remove
        const obs = (MockResizeObserver as any).observations;
        const index = obs.indexOf(target);
        if (index > -1) {
             // Mock behavior: we can track unobservations
             (MockResizeObserver as any).unobservations = (MockResizeObserver as any).unobservations || [];
             (MockResizeObserver as any).unobservations.push(target);
        }
    }
    disconnect() {}
}
(MockResizeObserver as any).instances = [];
(MockResizeObserver as any).observations = [];
(MockResizeObserver as any).unobservations = [];

global.ResizeObserver = MockResizeObserver as any;

describe('sticky-min-width directive', () => {
    afterEach(() => {
        (MockResizeObserver as any).instances = [];
        (MockResizeObserver as any).observations = [];
        (MockResizeObserver as any).unobservations = [];
    });

    it('should set up ResizeObserver', () => {
        const el = document.createElement('div');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vStickyMinWidth.beforeMount!(el, { value: true } as any, null as any, null as any);

        expect((MockResizeObserver as any).instances.length).toBe(1);
        expect((MockResizeObserver as any).observations).toContain(el);
    });

    it('should tear down on unmount', () => {
        const el = document.createElement('div');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vStickyMinWidth.beforeMount!(el, { value: true } as any, null as any, null as any);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vStickyMinWidth.beforeUnmount!(el, {} as any, null as any, null as any);

        expect((MockResizeObserver as any).unobservations).toContain(el);
    });
});
