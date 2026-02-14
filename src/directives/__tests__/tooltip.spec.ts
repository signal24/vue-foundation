import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { vTooltip } from '../tooltip';

vi.mock('@/components', () => ({
    showAlert: vi.fn()
}));

function mountTooltip(template: string, data: () => Record<string, unknown> = () => ({})) {
    return mount(
        defineComponent({
            directives: { tooltip: vTooltip },
            template,
            data
        }),
        { attachTo: document.body }
    );
}

describe('v-tooltip', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        document.querySelectorAll('.vf-tooltip').forEach(el => el.remove());
    });

    it('creates tooltip element on mouseenter', async () => {
        const wrapper = mountTooltip('<span v-tooltip="tip">Hover me</span>', () => ({ tip: 'Hello' }));
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        expect(document.querySelector('.vf-tooltip')).toBeTruthy();
    });

    it('removes tooltip on mouseleave', async () => {
        const wrapper = mountTooltip('<span v-tooltip="tip">Hover me</span>', () => ({ tip: 'Hello' }));
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        expect(document.querySelector('.vf-tooltip')).toBeTruthy();

        await wrapper.find('span').trigger('mouseleave');
        expect(document.querySelector('.vf-tooltip')).toBeFalsy();
    });

    it('uses binding value as tooltip content', async () => {
        const wrapper = mountTooltip('<span v-tooltip="tip">Hover me</span>', () => ({ tip: 'Tooltip text' }));
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        const tooltip = document.querySelector('.vf-tooltip .content');
        expect(tooltip?.textContent).toBe('Tooltip text');
    });

    it('falls back to tip attribute when binding is undefined', async () => {
        const wrapper = mountTooltip('<span v-tooltip tip="Attr tip">Hover me</span>');
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        const tooltip = document.querySelector('.vf-tooltip .content');
        expect(tooltip?.textContent).toBe('Attr tip');
    });

    it('destroys tooltip when value becomes null', async () => {
        const wrapper = mountTooltip('<span v-tooltip="tip">Hover me</span>', () => ({ tip: 'Hello' as string | null }));
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        expect(document.querySelector('.vf-tooltip')).toBeTruthy();
        await wrapper.find('span').trigger('mouseleave');

        await wrapper.setData({ tip: null });
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        expect(document.querySelector('.vf-tooltip')).toBeFalsy();
    });

    it('removes tooltip on click', async () => {
        const wrapper = mountTooltip('<span v-tooltip="tip">Hover me</span>', () => ({ tip: 'Hello' }));
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        expect(document.querySelector('.vf-tooltip')).toBeTruthy();

        await wrapper.find('span').trigger('click');
        expect(document.querySelector('.vf-tooltip')).toBeFalsy();
    });

    it('cleans up on unmount', async () => {
        const wrapper = mountTooltip('<span v-tooltip="tip">Hover me</span>', () => ({ tip: 'Hello' }));
        await wrapper.find('span').trigger('mouseenter');
        vi.runAllTimers();
        expect(document.querySelector('.vf-tooltip')).toBeTruthy();

        wrapper.unmount();
        expect(document.querySelector('.vf-tooltip')).toBeFalsy();
    });
});
