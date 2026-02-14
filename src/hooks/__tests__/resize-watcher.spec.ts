import { describe, expect, it, vi } from 'vitest';

import { withSetup } from '../../__test-utils__/with-setup';
import { useResizeWatcher } from '../resize-watcher';

describe('useResizeWatcher', () => {
    it('adds resize listener on mount', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const fn = vi.fn();

        withSetup(() => useResizeWatcher(fn));

        expect(addSpy).toHaveBeenCalledWith('resize', fn);
        addSpy.mockRestore();
    });

    it('removes resize listener on unmount', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const fn = vi.fn();

        const { app } = withSetup(() => useResizeWatcher(fn));
        app.unmount();

        expect(removeSpy).toHaveBeenCalledWith('resize', fn);
        removeSpy.mockRestore();
    });
});
