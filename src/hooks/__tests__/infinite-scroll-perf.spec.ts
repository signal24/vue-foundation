import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { discoverScrollableAncestorEl } from '../infinite-scroll';

describe('discoverScrollableAncestorEl Performance', () => {
    let container: HTMLElement;
    let list: HTMLElement;
    let items: HTMLElement[];

    beforeEach(() => {
        // Setup DOM
        // Container (scrollable) -> Wrapper -> Wrapper -> List -> Items (1000)
        container = document.createElement('div');
        container.style.overflow = 'auto';
        document.body.appendChild(container);

        let currentParent = container;
        for (let i = 0; i < 5; i++) {
            const div = document.createElement('div');
            currentParent.appendChild(div);
            currentParent = div;
        }

        list = currentParent;
        items = [];
        for (let i = 0; i < 1000; i++) {
            const item = document.createElement('div');
            list.appendChild(item);
            items.push(item);
        }
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('should find the scrollable ancestor correctly', () => {
        const ancestor = discoverScrollableAncestorEl(items[0]!);
        expect(ancestor).toBe(container);
    });

    it('should minimize getComputedStyle calls', () => {
        const spy = vi.spyOn(window, 'getComputedStyle');

        // Run discovery for all 1000 items
        for (const item of items) {
            discoverScrollableAncestorEl(item);
        }

        const callCount = spy.mock.calls.length;
        console.log(`getComputedStyle called ${callCount} times for 1000 items.`);

        // Without optimization, this will be around 7000.
        // We want it to be much lower, ideally close to the depth of the tree (e.g., < 20).
        // Setting a threshold that clearly indicates optimization.
        expect(callCount).toBeLessThan(100);
    });

    it('should invalidate cache on next tick', async () => {
        // First check
        const ancestor1 = discoverScrollableAncestorEl(items[0]!);
        expect(ancestor1).toBe(container);

        // Change structure: make List scrollable
        list.style.overflow = 'auto';

        // Immediate check (should be cached and return OLD ancestor)
        const ancestor2 = discoverScrollableAncestorEl(items[0]!);
        expect(ancestor2).toBe(container); // Stale result proves caching is active

        // Wait for next tick to invalidate cache
        await new Promise(resolve => setTimeout(resolve, 0));

        // Check again
        const ancestor3 = discoverScrollableAncestorEl(items[0]!);
        // Now it should be 'list' because cache was cleared and it re-evaluated
        expect(ancestor3).toBe(list);
    });
});
