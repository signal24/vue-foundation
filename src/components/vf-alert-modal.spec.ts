import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import VfAlertModal from './vf-alert-modal.vue';

// Mock OverlayContainer helpers
vi.mock('./overlay-container', () => ({
    dismissOverlayInjectionByInternalInstance: vi.fn()
}));

describe('VfAlertModal', () => {
    it('renders message', () => {
        const wrapper = mount(VfAlertModal, {
            props: {
                message: 'Hello World',
                callback: vi.fn()
            },
            global: {
                directives: {
                    autofocus: {}
                }
            }
        });

        expect(wrapper.html()).toContain('Hello World');
    });

    it('renders error message', () => {
        const wrapper = mount(VfAlertModal, {
            props: {
                message: new Error('Error occurred'),
                callback: vi.fn()
            },
            global: {
                directives: {
                    autofocus: {}
                }
            }
        });

        expect(wrapper.html()).toContain('Error occurred');
    });

    it('calls callback with true on confirm', async () => {
        const callback = vi.fn();
        const wrapper = mount(VfAlertModal, {
            props: {
                message: 'Alert',
                shouldConfirm: true,
                callback
            },
            global: {
                directives: {
                    autofocus: {}
                }
            }
        });

        const buttons = wrapper.findAll('button');
        const confirmBtn = buttons.find(b => b.text() === 'Confirm');

        await confirmBtn?.trigger('click');
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('calls callback with false on cancel', async () => {
        const callback = vi.fn();
        const wrapper = mount(VfAlertModal, {
            props: {
                message: 'Alert',
                shouldConfirm: true,
                callback
            },
            global: {
                directives: {
                    autofocus: {}
                }
            }
        });

        const buttons = wrapper.findAll('button');
        const cancelBtn = buttons.find(b => b.text() === 'Cancel');

        await cancelBtn?.trigger('click');
        expect(callback).toHaveBeenCalledWith(false);
    });
});
