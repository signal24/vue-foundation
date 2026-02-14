import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InfiniteScrollHandler } from '../infinite-scroll';

// Mock IntersectionObserver
let intersectionCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
    }
    observe = mockObserve;
    disconnect = mockDisconnect;
    unobserve = vi.fn();
    takeRecords = vi.fn().mockReturnValue([]);
    root = null;
    rootMargin = '';
    thresholds = [];
}

// Mock MutationObserver
const mockMutationObserve = vi.fn();
const mockMutationDisconnect = vi.fn();

class MockMutationObserver {
    constructor(_callback: MutationCallback) {}
    observe = mockMutationObserve;
    disconnect = mockMutationDisconnect;
    takeRecords = vi.fn().mockReturnValue([]);
}

describe('InfiniteScrollHandler', () => {
    beforeEach(() => {
        vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
        vi.stubGlobal('MutationObserver', MockMutationObserver);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    function triggerIntersection(isIntersecting: boolean) {
        intersectionCallback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
    }

    it('fires handler when sentinel becomes visible', () => {
        const handler = vi.fn();
        const el = document.createElement('div');
        new InfiniteScrollHandler(el, handler);

        triggerIntersection(true);
        expect(handler).toHaveBeenCalledOnce();
    });

    it('does not fire when sentinel is not visible', () => {
        const handler = vi.fn();
        const el = document.createElement('div');
        new InfiniteScrollHandler(el, handler);

        triggerIntersection(false);
        expect(handler).not.toHaveBeenCalled();
    });

    it('does not fire twice while sentinel stays visible (trip flag)', () => {
        const handler = vi.fn();
        const el = document.createElement('div');
        new InfiniteScrollHandler(el, handler);

        triggerIntersection(true);
        triggerIntersection(true);
        expect(handler).toHaveBeenCalledOnce();
    });

    it('resets trip flag when sentinel leaves viewport', () => {
        const handler = vi.fn();
        const el = document.createElement('div');
        new InfiniteScrollHandler(el, handler);

        triggerIntersection(true);
        expect(handler).toHaveBeenCalledOnce();

        // Sentinel leaves viewport
        triggerIntersection(false);

        // Sentinel re-enters viewport
        triggerIntersection(true);
        expect(handler).toHaveBeenCalledTimes(2);
    });

    it('uninstall disconnects observers and removes sentinel', () => {
        const handler = vi.fn();
        const el = document.createElement('div');
        const scrollHandler = new InfiniteScrollHandler(el, handler);

        scrollHandler.uninstall();

        expect(mockDisconnect).toHaveBeenCalled();
        expect(mockMutationDisconnect).toHaveBeenCalled();
        expect(el.querySelector('div')).toBeNull();
    });

    it('reinstall re-creates observers', () => {
        const handler = vi.fn();
        const el = document.createElement('div');
        const scrollHandler = new InfiniteScrollHandler(el, handler);

        scrollHandler.uninstall();
        scrollHandler.install();

        triggerIntersection(true);
        expect(handler).toHaveBeenCalledOnce();
    });
});
