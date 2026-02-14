import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { InfiniteScrollHandler } from './infinite-scroll';

// Mock IntersectionObserver
const observeMock = vi.fn();
const unobserveMock = vi.fn();
const disconnectMock = vi.fn();

let intersectionCallback: IntersectionObserverCallback;

class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
    }

    observe = observeMock;
    unobserve = unobserveMock;
    disconnect = disconnectMock;
    takeRecords = () => [];
}

global.IntersectionObserver = IntersectionObserverMock;

describe('InfiniteScrollHandler', () => {
    let container: HTMLElement;
    let handler: Mock;
    let scrollHandler: InfiniteScrollHandler;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        handler = vi.fn();
        observeMock.mockClear();
        unobserveMock.mockClear();
        disconnectMock.mockClear();
    });

    afterEach(() => {
        if (scrollHandler) {
            scrollHandler.uninstall();
        }
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
        vi.restoreAllMocks();
    });

    it('should install sentinel and observer', () => {
        scrollHandler = new InfiniteScrollHandler(container, handler);

        expect(container.lastElementChild).toBeDefined();
        // Check if sentinel is created
        const sentinel = container.lastElementChild as HTMLElement;
        expect(sentinel.style.opacity).toBe('0');
        expect(sentinel.style.pointerEvents).toBe('none');

        expect(observeMock).toHaveBeenCalledWith(sentinel);
    });

    it('should trigger handler when sentinel intersects', () => {
        scrollHandler = new InfiniteScrollHandler(container, handler);
        const sentinel = container.lastElementChild as Element;

        // Simulate intersection
        const entry: IntersectionObserverEntry = {
            isIntersecting: true,
            target: sentinel,
            intersectionRatio: 1,
            boundingClientRect: sentinel.getBoundingClientRect(),
            intersectionRect: sentinel.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now()
        };

        intersectionCallback([entry], {} as IntersectionObserver);

        expect(handler).toHaveBeenCalled();
    });

    it('should not trigger handler when sentinel does not intersect', () => {
        scrollHandler = new InfiniteScrollHandler(container, handler);
        const sentinel = container.lastElementChild as Element;

        // Simulate non-intersection
        const entry: IntersectionObserverEntry = {
            isIntersecting: false,
            target: sentinel,
            intersectionRatio: 0,
            boundingClientRect: sentinel.getBoundingClientRect(),
            intersectionRect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => {} },
            rootBounds: null,
            time: Date.now()
        };

        intersectionCallback([entry], {} as IntersectionObserver);

        expect(handler).not.toHaveBeenCalled();
    });

    it('should move sentinel to bottom when content is added', async () => {
        scrollHandler = new InfiniteScrollHandler(container, handler);
        const initialSentinel = container.lastElementChild as Element;

        // Add new content
        const newContent = document.createElement('div');
        container.appendChild(newContent);

        // Wait for MutationObserver (it's async)
        await new Promise(resolve => setTimeout(resolve, 0));

        const newSentinel = container.lastElementChild as Element;
        // The sentinel should be moved to be after newContent
        expect(newSentinel).toBe(initialSentinel);
        expect(container.lastElementChild).toBe(initialSentinel);
        expect(newContent.nextElementSibling).toBe(initialSentinel);
    });

    it('should uninstall correctly', () => {
        scrollHandler = new InfiniteScrollHandler(container, handler);
        const sentinel = container.lastElementChild as Element;

        scrollHandler.uninstall();

        expect(disconnectMock).toHaveBeenCalled();
        expect(container.contains(sentinel)).toBe(false);
    });

    it('should handle window as container', () => {
        // Mock window passed as element
        // Since we can't really pass window to appendChild, logic should use document.body
        const win = window as unknown as Element;
        scrollHandler = new InfiniteScrollHandler(win, handler);

        expect(document.body.lastElementChild).toBeDefined();
        const sentinel = document.body.lastElementChild as HTMLElement;
        expect(sentinel.style.opacity).toBe('0');

        expect(observeMock).toHaveBeenCalledWith(sentinel);

        scrollHandler.uninstall();
        expect(document.body.contains(sentinel)).toBe(false);
    });
});
