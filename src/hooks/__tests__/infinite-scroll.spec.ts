import { describe, expect, it, vi } from 'vitest';

import { InfiniteScrollHandler } from '../infinite-scroll';

describe('InfiniteScrollHandler', () => {
    function createScrollableEl(scrollTop: number, clientHeight: number, scrollHeight: number) {
        const el = document.createElement('div');
        Object.defineProperty(el, 'scrollTop', { value: scrollTop, writable: true, configurable: true });
        Object.defineProperty(el, 'clientHeight', { value: clientHeight, writable: true, configurable: true });
        Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, writable: true, configurable: true });
        return el;
    }

    it('fires handler when scrolled to bottom', () => {
        const handler = vi.fn();
        // scrollTop(95) + clientHeight(100) + 5 >= scrollHeight(200) → 200 >= 200 → true
        const el = createScrollableEl(95, 100, 200);
        new InfiniteScrollHandler(el, handler);

        el.dispatchEvent(new Event('scroll'));
        expect(handler).toHaveBeenCalledOnce();
    });

    it('does not fire when not at bottom', () => {
        const handler = vi.fn();
        // scrollTop(10) + clientHeight(100) + 5 >= scrollHeight(200) → 115 >= 200 → false
        const el = createScrollableEl(10, 100, 200);
        new InfiniteScrollHandler(el, handler);

        el.dispatchEvent(new Event('scroll'));
        expect(handler).not.toHaveBeenCalled();
    });

    it('does not fire twice while still at bottom (trip flag)', () => {
        const handler = vi.fn();
        const el = createScrollableEl(95, 100, 200);
        new InfiniteScrollHandler(el, handler);

        el.dispatchEvent(new Event('scroll'));
        el.dispatchEvent(new Event('scroll'));
        expect(handler).toHaveBeenCalledOnce();
    });

    it('resets trip flag when scrolling away from bottom', () => {
        const handler = vi.fn();
        const el = createScrollableEl(95, 100, 200);
        new InfiniteScrollHandler(el, handler);

        el.dispatchEvent(new Event('scroll'));
        expect(handler).toHaveBeenCalledOnce();

        // Scroll away from bottom
        Object.defineProperty(el, 'scrollTop', { value: 10, configurable: true });
        el.dispatchEvent(new Event('scroll'));

        // Scroll back to bottom
        Object.defineProperty(el, 'scrollTop', { value: 95, configurable: true });
        el.dispatchEvent(new Event('scroll'));
        expect(handler).toHaveBeenCalledTimes(2);
    });

    it('uninstall removes scroll listener', () => {
        const handler = vi.fn();
        const el = createScrollableEl(95, 100, 200);
        const scrollHandler = new InfiniteScrollHandler(el, handler);

        scrollHandler.uninstall();
        el.dispatchEvent(new Event('scroll'));
        expect(handler).not.toHaveBeenCalled();
    });

    it('reinstall re-adds scroll listener', () => {
        const handler = vi.fn();
        const el = createScrollableEl(95, 100, 200);
        const scrollHandler = new InfiniteScrollHandler(el, handler);

        scrollHandler.uninstall();
        scrollHandler.install();
        el.dispatchEvent(new Event('scroll'));
        expect(handler).toHaveBeenCalledOnce();
    });
});
