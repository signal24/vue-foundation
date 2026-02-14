import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import VfModal from '../vf-modal.vue';

function mountModal(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
    return mount(VfModal, {
        props,
        slots: {
            default: '<p>Modal content</p>',
            ...slots
        },
        attachTo: document.body
    });
}

describe('VfModal', () => {
    it('renders default slot content', () => {
        const wrapper = mountModal();
        expect(wrapper.find('.vf-modal-content').text()).toBe('Modal content');
    });

    it('renders header slot', () => {
        const wrapper = mountModal({}, { header: '<span>Title</span>' });
        expect(wrapper.find('.vf-modal-header').exists()).toBe(true);
        expect(wrapper.find('.vf-modal-header').text()).toBe('Title');
    });

    it('hides header when no header slot', () => {
        const wrapper = mountModal();
        expect(wrapper.find('.vf-modal-header').exists()).toBe(false);
    });

    it('renders footer slot', () => {
        const wrapper = mountModal({}, { footer: '<button>Save</button>' });
        expect(wrapper.find('.vf-modal-footer').exists()).toBe(true);
        expect(wrapper.find('.vf-modal-footer button').text()).toBe('Save');
    });

    it('hides footer when no footer slot', () => {
        const wrapper = mountModal();
        expect(wrapper.find('.vf-modal-footer').exists()).toBe(false);
    });

    it('adds vf-modal-open class to body on mount', () => {
        const wrapper = mountModal();
        expect(document.body.classList.contains('vf-modal-open')).toBe(true);
        wrapper.unmount();
    });

    it('keeps vf-modal-open when other modals still exist', () => {
        const wrapper1 = mountModal();
        const wrapper2 = mountModal();
        wrapper2.unmount();
        expect(document.body.classList.contains('vf-modal-open')).toBe(true);
        wrapper1.unmount();
    });

    it('applies custom id', () => {
        const wrapper = mountModal({ id: 'my-modal' });
        expect(wrapper.find('#my-modal').exists()).toBe(true);
    });

    it('applies custom class string', () => {
        const wrapper = mountModal({ class: 'wide' });
        expect(wrapper.find('.vf-overlay').classes()).toContain('wide');
    });

    it('applies custom class array', () => {
        const wrapper = mountModal({ class: ['wide', 'tall'] });
        const classes = wrapper.find('.vf-overlay').classes();
        expect(classes).toContain('wide');
        expect(classes).toContain('tall');
    });

    it('adds scrolls class when scrolls prop is true', () => {
        const wrapper = mountModal({ scrolls: true });
        expect(wrapper.find('.vf-modal').classes()).toContain('scrolls');
    });

    it('shows close X when closeX prop is true', () => {
        const wrapper = mountModal({ closeX: true }, { header: '<span>Title</span>' });
        expect(wrapper.find('.vf-modal-header .close').exists()).toBe(true);
    });

    it('emits formSubmit on form submission', async () => {
        const wrapper = mountModal();
        await wrapper.find('form').trigger('submit');
        expect(wrapper.emitted('formSubmit')).toHaveLength(1);
    });

    it('calls onClose when close X is clicked', async () => {
        const onClose = vi.fn();
        const wrapper = mountModal({ closeX: true, onClose }, { header: '<span>Title</span>' });
        await wrapper.find('.close').trigger('click');
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('closes on Escape key when closeOnMaskClick is true', async () => {
        const onClose = vi.fn();
        mountModal({ closeOnMaskClick: true, onClose });
        globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not close on Escape when closeOnMaskClick is false', () => {
        const onClose = vi.fn();
        mountModal({ onClose });
        globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('closes on overlay click when closeOnMaskClick is true', async () => {
        const onClose = vi.fn();
        const wrapper = mountModal({ closeOnMaskClick: true, onClose });
        await wrapper.find('.vf-overlay').trigger('click');
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not close when clicking inside the modal', async () => {
        const onClose = vi.fn();
        const wrapper = mountModal({ closeOnMaskClick: true, onClose });
        await wrapper.find('.vf-modal').trigger('click');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('exposes hide/unhide methods', async () => {
        const wrapper = mountModal();
        const vm = wrapper.vm as InstanceType<typeof VfModal>;

        vm.hide();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.vf-overlay').classes()).toContain('hidden');

        vm.unhide();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.vf-overlay').classes()).not.toContain('hidden');
    });

    it('hide returns unhide function', async () => {
        const wrapper = mountModal();
        const vm = wrapper.vm as InstanceType<typeof VfModal>;

        const unhide = vm.hide();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.vf-overlay').classes()).toContain('hidden');

        unhide();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.vf-overlay').classes()).not.toContain('hidden');
    });
});
