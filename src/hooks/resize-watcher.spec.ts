import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { useResizeWatcher } from './resize-watcher';

describe('useResizeWatcher', () => {
    it('throttles resize events', async () => {
        vi.useFakeTimers();
        const callback = vi.fn();

        const TestComponent = defineComponent({
            setup() {
                useResizeWatcher(callback);
                return {};
            },
            template: '<div></div>'
        });

        const wrapper = mount(TestComponent);

        // Simulate 10 resize events over 100ms
        for (let i = 0; i < 10; i++) {
            window.dispatchEvent(new Event('resize'));
            vi.advanceTimersByTime(10);
        }

        // Throttle is 200ms. Leading edge executes immediately.
        // We are at T=100ms, so only the first call should have happened.
        expect(callback).toHaveBeenCalledTimes(1);

        // Advance time to allow the trailing edge execution (at T=200ms)
        vi.advanceTimersByTime(100);
        expect(callback).toHaveBeenCalledTimes(2);

        wrapper.unmount();
        vi.useRealTimers();
    });
});
