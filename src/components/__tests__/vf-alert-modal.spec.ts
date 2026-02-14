import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { vAutofocus } from '../../directives/autofocus';
import VfAlertModal from '../vf-alert-modal.vue';

function mountAlertModal(props: Record<string, unknown> = {}) {
    return mount(VfAlertModal, {
        props: {
            message: 'Test message',
            callback: vi.fn(),
            ...props
        },
        global: {
            directives: { autofocus: vAutofocus }
        },
        attachTo: document.body
    });
}

describe('VfAlertModal', () => {
    it('displays message text', () => {
        const wrapper = mountAlertModal({ message: 'Something happened' });
        expect(wrapper.text()).toContain('Something happened');
    });

    it('displays title in header', () => {
        const wrapper = mountAlertModal({ title: 'Alert Title' });
        expect(wrapper.find('.vf-modal-header').text()).toBe('Alert Title');
    });

    it('hides header when no title', () => {
        const wrapper = mountAlertModal();
        expect(wrapper.find('.vf-modal-header').exists()).toBe(false);
    });

    it('shows OK button for alerts (non-confirm)', () => {
        const wrapper = mountAlertModal();
        const buttons = wrapper.findAll('button');
        expect(buttons).toHaveLength(1);
        expect(buttons[0]!.text()).toBe('OK');
    });

    it('calls callback(true) when OK is clicked', async () => {
        const callback = vi.fn();
        const wrapper = mountAlertModal({ callback });
        await wrapper.find('button').trigger('click');
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('shows Confirm and Cancel buttons for confirm mode', () => {
        const wrapper = mountAlertModal({ shouldConfirm: true });
        const buttons = wrapper.findAll('button');
        expect(buttons).toHaveLength(2);
        expect(buttons[0]!.text()).toBe('Confirm');
        expect(buttons[1]!.text()).toBe('Cancel');
    });

    it('calls callback(true) when Confirm is clicked', async () => {
        const callback = vi.fn();
        const wrapper = mountAlertModal({ shouldConfirm: true, callback });
        await wrapper.findAll('button')[0]!.trigger('click');
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('calls callback(false) when Cancel is clicked', async () => {
        const callback = vi.fn();
        const wrapper = mountAlertModal({ shouldConfirm: true, callback });
        await wrapper.findAll('button')[1]!.trigger('click');
        expect(callback).toHaveBeenCalledWith(false);
    });

    it('hides footer when isBare is true', () => {
        const wrapper = mountAlertModal({ isBare: true });
        expect(wrapper.find('.vf-modal-footer').exists()).toBe(false);
    });

    it('applies custom classes', () => {
        const wrapper = mountAlertModal({ classes: ['destructive'] });
        expect(wrapper.find('.vf-alert').classes()).toContain('destructive');
    });

    it('renders icon when iconClass is provided', () => {
        const wrapper = mountAlertModal({ iconClass: 'fa fa-spinner' });
        expect(wrapper.find('.vf-alert-icon').exists()).toBe(true);
    });

    it('formats Error objects', () => {
        const error = new Error('Something went wrong');
        const wrapper = mountAlertModal({ message: error });
        expect(wrapper.text()).toContain('Something went wrong');
    });

    it('renders HTML when isHtml is true', () => {
        const wrapper = mountAlertModal({ message: '<strong>Bold</strong>', isHtml: true });
        const htmlDiv = wrapper.find('.user-message');
        expect(htmlDiv.exists()).toBe(true);
        expect(htmlDiv.element.innerHTML).toBe('<strong>Bold</strong>');
    });

    it('escapes HTML when isHtml is false', () => {
        const wrapper = mountAlertModal({ message: '<strong>Bold</strong>' });
        expect(wrapper.find('.user-message').exists()).toBe(false);
        expect(wrapper.text()).toContain('<strong>Bold</strong>');
    });
});
