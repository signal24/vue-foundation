import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VfToast from '../vf-toast.vue';

function mountToast(props: Record<string, unknown> = {}) {
    return mount(VfToast, {
        props: {
            message: 'Toast message',
            callback: vi.fn(),
            ...props
        },
        attachTo: document.body
    });
}

describe('VfToast', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('displays message text', () => {
        const wrapper = mountToast();
        expect(wrapper.find('.message').text()).toBe('Toast message');
    });

    it('applies bottom class by default', () => {
        const wrapper = mountToast();
        expect(wrapper.find('.vf-toast').classes()).toContain('bottom');
    });

    it('applies top class when position is top', () => {
        const wrapper = mountToast({ position: 'top' });
        expect(wrapper.find('.vf-toast').classes()).toContain('top');
    });

    it('applies custom className', () => {
        const wrapper = mountToast({ className: 'success' });
        expect(wrapper.find('.vf-toast').classes()).toContain('success');
    });

    it('shows close button by default', () => {
        const wrapper = mountToast();
        expect(wrapper.find('.close').exists()).toBe(true);
    });

    it('hides close button when disableClose is true', () => {
        const wrapper = mountToast({ disableClose: true });
        expect(wrapper.find('.close').exists()).toBe(false);
    });

    it('calls callback when close button is clicked', async () => {
        const callback = vi.fn();
        const wrapper = mountToast({ callback });
        await wrapper.find('.close').trigger('click');
        expect(callback).toHaveBeenCalledOnce();
    });

    it('auto-dismisses after durationSecs', () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        mountToast({ callback, durationSecs: 3 });
        expect(callback).not.toHaveBeenCalled();
        vi.advanceTimersByTime(3000);
        expect(callback).toHaveBeenCalledOnce();
    });

    it('uses default 5s duration when durationSecs is not specified', () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        mountToast({ callback });
        vi.advanceTimersByTime(4999);
        expect(callback).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(callback).toHaveBeenCalledOnce();
    });

    it('does not auto-dismiss when durationSecs is null', () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        mountToast({ callback, durationSecs: null });
        vi.advanceTimersByTime(60000);
        expect(callback).not.toHaveBeenCalled();
    });

    it('shows progress bar when durationSecs is not null', () => {
        const wrapper = mountToast();
        expect(wrapper.find('.progress-bar').exists()).toBe(true);
    });

    it('hides progress bar when durationSecs is null', () => {
        const wrapper = mountToast({ durationSecs: null });
        expect(wrapper.find('.progress-bar').exists()).toBe(false);
    });

    it('calls onClick and callback when toast is clicked with onClick handler', async () => {
        const callback = vi.fn();
        const onClick = vi.fn();
        const wrapper = mountToast({ callback, onClick });
        await wrapper.find('.vf-toast').trigger('click');
        expect(onClick).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledOnce();
    });

    it('does not dismiss on click when disableClose is true and no onClick', async () => {
        const callback = vi.fn();
        const wrapper = mountToast({ callback, disableClose: true, durationSecs: null });
        await wrapper.find('.vf-toast').trigger('click');
        expect(callback).not.toHaveBeenCalled();
    });
});
