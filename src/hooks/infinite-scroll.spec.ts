import { describe, expect, it, vi } from 'vitest';

import { InfiniteScrollHandler } from './infinite-scroll';

describe('InfiniteScrollHandler', () => {
    it('throttles scroll event handling', () => {
        const el = document.createElement('div');
        const handler = vi.fn();

        let scrollTopAccessCount = 0;
        Object.defineProperty(el, 'scrollTop', {
            get: () => {
                scrollTopAccessCount++;
                return 0;
            },
            configurable: true
        });
        Object.defineProperty(el, 'clientHeight', { value: 100 });
        Object.defineProperty(el, 'scrollHeight', { value: 1000 });

        const handlerInstance = new InfiniteScrollHandler(el, handler);

        // Simulate 100 scroll events rapidly
        for (let i = 0; i < 100; i++) {
            el.dispatchEvent(new Event('scroll'));
        }

        // With throttling (200ms), synchronous execution of 100 events should result in very few calls (likely 1)
        expect(scrollTopAccessCount).toBeLessThan(5);

        // Verify uninstall works without error (and calls cancel)
        handlerInstance.uninstall();
    });
});
