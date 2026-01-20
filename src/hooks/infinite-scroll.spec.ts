import { onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { InfiniteScrollHandler, useInfiniteScroll } from './infinite-scroll';

vi.mock('vue', () => ({
    getCurrentInstance: vi.fn(() => ({
        vnode: {
            el: document.createElement('div')
        }
    })),
    onMounted: vi.fn(),
    onActivated: vi.fn(),
    onDeactivated: vi.fn(),
    onBeforeUnmount: vi.fn()
}));

describe('infinite-scroll hook', () => {
    describe('useInfiniteScroll', () => {
        it('should register lifecycle hooks', () => {
            const options = { elScrolledToBottom: vi.fn() };
            useInfiniteScroll(options);

            expect(onMounted).toHaveBeenCalled();
            expect(onActivated).toHaveBeenCalled();
            expect(onDeactivated).toHaveBeenCalled();
            expect(onBeforeUnmount).toHaveBeenCalled();
        });
    });

    describe('InfiniteScrollHandler', () => {
        it('should handle scroll', () => {
            const el = document.createElement('div');
            // Mock properties
            Object.defineProperty(el, 'scrollTop', { value: 100, writable: true });
            Object.defineProperty(el, 'clientHeight', { value: 100, writable: true });
            Object.defineProperty(el, 'scrollHeight', { value: 200, writable: true });

            const handler = vi.fn();
            const scrollHandler = new InfiniteScrollHandler(el, handler);

            // Trigger scroll
            // scrollTop + clientHeight + 5 >= scrollHeight
            // 100 + 100 + 5 >= 200 (True)
            el.dispatchEvent(new Event('scroll'));
            expect(handler).toHaveBeenCalled();

            handler.mockClear();

            // Should not trigger again immediately (isTripped)
            el.dispatchEvent(new Event('scroll'));
            expect(handler).not.toHaveBeenCalled();

            // Reset position to untrip
            Object.defineProperty(el, 'scrollTop', { value: 0, writable: true });
            el.dispatchEvent(new Event('scroll'));
            expect(handler).not.toHaveBeenCalled();

            // Scroll to bottom again
            Object.defineProperty(el, 'scrollTop', { value: 100, writable: true });
            el.dispatchEvent(new Event('scroll'));
            expect(handler).toHaveBeenCalled();
        });
    });
});
