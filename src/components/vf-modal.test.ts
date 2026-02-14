import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { OverlayContainer, presentOverlay } from './overlay-container';
import VfModal from './vf-modal.vue';

// Mock component for a generic overlay (like dropdown)
const TestDropdown = defineComponent({
    template: '<div class="test-dropdown">Dropdown Content</div>'
});

describe('Modal Stacking', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        // Mount the OverlayContainer which renders the overlays
        wrapper = mount(OverlayContainer, {
            attachTo: document.body
        });
    });

    afterEach(() => {
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    it('correctly applies is-covered class to stacked modals', async () => {
        // 1. Open first modal
        presentOverlay(
            VfModal,
            {
                // @ts-expect-error - 'class' prop is stripped by CleanProps but VfModal accepts it
                class: 'modal-1'
            },
            {}
        );

        await nextTick();
        await nextTick();
        // Allow MutationObserver to fire
        await new Promise(r => setTimeout(r, 50));

        const modalWraps = () => document.querySelectorAll('.vf-modal-wrap');
        expect(modalWraps().length).toBe(1);
        expect(modalWraps()[0]!.classList.contains('is-covered')).toBe(false);

        // 2. Open second modal
        const p2 = presentOverlay(
            VfModal,
            {
                // @ts-expect-error - 'class' prop is stripped by CleanProps but VfModal accepts it
                class: 'modal-2',
                closeOnMaskClick: true
            },
            {}
        );

        await nextTick();
        await nextTick();
        await new Promise(r => setTimeout(r, 50));

        expect(modalWraps().length).toBe(2);
        // First modal should now be covered
        expect(modalWraps()[0]!.classList.contains('is-covered')).toBe(true);
        // Second modal should NOT be covered
        expect(modalWraps()[1]!.classList.contains('is-covered')).toBe(false);

        // 3. Open a non-modal overlay (e.g. dropdown)
        presentOverlay(TestDropdown, {}, {});

        await nextTick();
        await nextTick();
        await new Promise(r => setTimeout(r, 50));

        // Second modal should STILL NOT be covered, because the new overlay is not a modal
        expect(modalWraps()[1]!.classList.contains('is-covered')).toBe(false);

        // 4. Close the second modal
        // Simulate Escape key to close the top-most modal (which handles Escape)
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        await p2; // Wait for closure
        await nextTick();
        await new Promise(r => setTimeout(r, 50));

        // Now modal 2 should be gone.
        expect(modalWraps().length).toBe(1);

        // Modal 1 should NOT be covered anymore
        expect(modalWraps()[0]!.classList.contains('is-covered')).toBe(false);
    });
});
