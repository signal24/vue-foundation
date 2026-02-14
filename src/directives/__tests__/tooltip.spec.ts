import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { vTooltip } from '../tooltip';

// Mock showAlert to avoid external dependencies
vi.mock('@/components', () => ({
    showAlert: vi.fn()
}));

const TestComponent = defineComponent({
    directives: {
        tooltip: vTooltip
    },
    template: '<div id="target" v-tooltip="\'Test Tooltip\'" html>Hover me</div>'
});

describe('vTooltip', () => {
    beforeEach(() => {
        // Clear document body before each test
        document.body.innerHTML = '';
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('shows tooltip on mouseenter', async () => {
        const wrapper = mount(TestComponent, { attachTo: document.body });
        const target = wrapper.find('#target');

        // Trigger mouseenter
        await target.trigger('mouseenter');
        vi.advanceTimersByTime(100); // Advance timers to account for delay

        // Check if tooltip is in DOM
        const tooltip = document.querySelector('.vf-tooltip');
        expect(tooltip).not.toBeNull();
        expect(tooltip?.textContent).toContain('Test Tooltip');

        wrapper.unmount();
    });

    it('removes tooltip when target is removed from DOM', async () => {
        const wrapper = mount(TestComponent, { attachTo: document.body });
        const target = wrapper.find('#target');

        // Trigger mouseenter
        await target.trigger('mouseenter');
        vi.advanceTimersByTime(100);

        // Verify tooltip exists
        let tooltip = document.querySelector('.vf-tooltip');
        expect(tooltip).not.toBeNull();

        // Simulate removal of target from DOM
        // We remove the element directly, bypassing Vue's unmount
        // This simulates an external library or manual DOM manipulation
        target.element.remove();

        // Wait for MutationObserver to pick up the change
        // MutationObserver callbacks are executed as microtasks
        await Promise.resolve(); // Wait for microtasks
        vi.advanceTimersByTime(300); // Advance timers just in case (polling fallback or delay)
        await Promise.resolve();

        // Verify tooltip is gone
        tooltip = document.querySelector('.vf-tooltip');
        expect(tooltip).toBeNull();

        wrapper.unmount();
    });
});
