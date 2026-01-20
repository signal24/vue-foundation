import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('OverlayAnchor', () => {
    it('renders and computes styles', async () => {
        vi.doMock('./overlay-container', () => ({
            dismissOverlayInjectionById: vi.fn()
        }));

        const { default: OverlayAnchor } = await import('./overlay-anchor.vue');

        const anchorEl = document.createElement('div');
        anchorEl.style.width = '100px';
        anchorEl.style.height = '50px';
        anchorEl.style.position = 'absolute';
        anchorEl.style.top = '100px';
        anchorEl.style.left = '100px';
        document.body.appendChild(anchorEl);

        const wrapper = mount(OverlayAnchor, {
            props: {
                overlayId: '123',
                anchor: {
                    el: anchorEl,
                    matchWidth: true
                }
            },
            attachTo: document.body
        });

        expect(wrapper.exists()).toBe(true);
    });
});
