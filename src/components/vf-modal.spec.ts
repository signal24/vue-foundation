import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import VfModal from './vf-modal.vue';

describe('VfModal', () => {
    it('renders slot content', () => {
        const wrapper = mount(VfModal, {
            slots: {
                default: '<p>Modal Content</p>'
            }
        });

        expect(wrapper.text()).toContain('Modal Content');
    });

    it('emits close event on overlay click if closeOnMaskClick is true', async () => {
        const onClose = vi.fn();
        const wrapper = mount(VfModal, {
            props: {
                closeOnMaskClick: true,
                onClose
            }
        });

        await wrapper.find('.vf-modal-wrap').trigger('click');
        expect(onClose).toHaveBeenCalled();
    });

    it('does not emit close event on overlay click if closeOnMaskClick is false', async () => {
        const onClose = vi.fn();
        const wrapper = mount(VfModal, {
            props: {
                closeOnMaskClick: false,
                onClose
            }
        });

        await wrapper.find('.vf-modal-wrap').trigger('click');
        expect(onClose).not.toHaveBeenCalled();
    });
});
