import { onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { useResizeWatcher } from './resize-watcher';

vi.mock('vue', () => ({
    onMounted: vi.fn(),
    onActivated: vi.fn(),
    onDeactivated: vi.fn(),
    onBeforeUnmount: vi.fn()
}));

describe('resize-watcher hook', () => {
    it('should register listeners', () => {
        const fn = vi.fn();
        useResizeWatcher(fn);

        expect(onMounted).toHaveBeenCalled();
        expect(onActivated).toHaveBeenCalled();
        expect(onDeactivated).toHaveBeenCalled();
        expect(onBeforeUnmount).toHaveBeenCalled();

        // Verify listeners are added/removed
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        // Execute callbacks passed to hooks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onMountedCb = (onMounted as any).mock.calls[0][0];
        onMountedCb();
        expect(addSpy).toHaveBeenCalledWith('resize', fn);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onDeactivatedCb = (onDeactivated as any).mock.calls[0][0];
        onDeactivatedCb();
        expect(removeSpy).toHaveBeenCalledWith('resize', fn);
    });
});
