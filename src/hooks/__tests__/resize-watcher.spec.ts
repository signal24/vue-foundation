import { describe, expect, it, vi } from 'vitest';

import { withSetup } from '../../__test-utils__/with-setup';
import { useResizeWatcher } from '../resize-watcher';

describe('useResizeWatcher', () => {
    it('adds resize listener on mount', () => {
        const addSpy = vi.spyOn(globalThis, 'addEventListener');
        const fn = vi.fn();

        withSetup(() => useResizeWatcher(fn));

        expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        addSpy.mockRestore();
    });

    it('removes resize listener on unmount', () => {
        const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
        const fn = vi.fn();

        const { app } = withSetup(() => useResizeWatcher(fn));
        app.unmount();

        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        removeSpy.mockRestore();
    });

    it('throttles the callback', async () => {
        vi.useFakeTimers();
        const fn = vi.fn();

        withSetup(() => useResizeWatcher(fn));

        globalThis.dispatchEvent(new Event('resize'));
        globalThis.dispatchEvent(new Event('resize'));
        globalThis.dispatchEvent(new Event('resize'));

        // throttle fires on the leading edge
        expect(fn).toHaveBeenCalledOnce();

        vi.advanceTimersByTime(200);

        // trailing call fires after throttle period
        expect(fn).toHaveBeenCalledTimes(2);

        vi.useRealTimers();
    });
});
