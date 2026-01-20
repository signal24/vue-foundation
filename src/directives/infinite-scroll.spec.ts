import { describe, expect, it, vi } from 'vitest';

import { vInfiniteScroll } from './infinite-scroll';

const installSpy = vi.fn();
const uninstallSpy = vi.fn();
const constructorSpy = vi.fn();

vi.mock('../hooks/infinite-scroll', () => ({
    InfiniteScrollHandler: class MockInfiniteScrollHandler {
        constructor(public el: any, public handler: any) {
            constructorSpy(el, handler);
        }
        install() { installSpy(); }
        uninstall() { uninstallSpy(); }
    }
}));

describe('infinite-scroll directive', () => {
    it('should create handler on mounted', () => {
        const el = document.createElement('div');
        const handler = vi.fn();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vInfiniteScroll.mounted!(el, { value: handler } as any, null as any, null as any);

        expect(constructorSpy).toHaveBeenCalledWith(el, handler);
    });

    it('should reinstall on updated', () => {
        const el = document.createElement('div');
        const handler = vi.fn();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vInfiniteScroll.mounted!(el, { value: handler } as any, null as any, null as any);

        // Reset spies
        constructorSpy.mockClear();
        installSpy.mockClear();
        uninstallSpy.mockClear();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vInfiniteScroll.updated!(el, { value: handler } as any, null as any, null as any);

        expect(uninstallSpy).toHaveBeenCalled(); // Uninstalls old
        expect(constructorSpy).toHaveBeenCalledWith(el, handler); // Creates new
    });

    it('should uninstall on unmounted', () => {
        const el = document.createElement('div');
        const handler = vi.fn();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vInfiniteScroll.mounted!(el, { value: handler } as any, null as any, null as any);

        uninstallSpy.mockClear();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vInfiniteScroll.unmounted!(el, { value: handler } as any, null as any, null as any);

        expect(uninstallSpy).toHaveBeenCalled();
    });
});
