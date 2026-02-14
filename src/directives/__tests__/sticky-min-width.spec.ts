import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { VfOptions } from '../../config';
import { vStickyMinWidth } from '../sticky-min-width';

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();

class MockResizeObserver {
    observe = mockObserve;
    unobserve = mockUnobserve;
    disconnect = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_callback: ResizeObserverCallback) {
        // callback stored internally by the real ResizeObserver
    }
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);

function mountStickyMinWidth(template: string, data: () => Record<string, unknown> = () => ({})) {
    return mount(
        defineComponent({
            directives: { stickyMinWidth: vStickyMinWidth },
            template,
            data
        }),
        { attachTo: document.body }
    );
}

describe('v-sticky-min-width', () => {
    afterEach(() => {
        mockObserve.mockClear();
        mockUnobserve.mockClear();
        VfOptions.disableStickyMinWidthDirective = undefined;
    });

    it('sets up ResizeObserver on mount', () => {
        mountStickyMinWidth('<div v-sticky-min-width>Content</div>');
        expect(mockObserve).toHaveBeenCalledOnce();
    });

    it('tears down ResizeObserver on unmount', () => {
        const wrapper = mountStickyMinWidth('<div v-sticky-min-width>Content</div>');
        wrapper.unmount();
        expect(mockUnobserve).toHaveBeenCalledOnce();
    });

    it('does not set up when value is false', () => {
        mountStickyMinWidth('<div v-sticky-min-width="enabled">Content</div>', () => ({ enabled: false }));
        expect(mockObserve).not.toHaveBeenCalled();
    });

    it('does not set up when disableStickyMinWidthDirective is true', () => {
        VfOptions.disableStickyMinWidthDirective = true;
        mountStickyMinWidth('<div v-sticky-min-width>Content</div>');
        expect(mockObserve).not.toHaveBeenCalled();
    });

    it('tears down when value changes to false', async () => {
        const wrapper = mountStickyMinWidth('<div v-sticky-min-width="enabled">Content</div>', () => ({ enabled: true }));
        expect(mockObserve).toHaveBeenCalledOnce();

        await wrapper.setData({ enabled: false });
        expect(mockUnobserve).toHaveBeenCalledOnce();
    });

    it('sets up when value changes from false to true', async () => {
        const wrapper = mountStickyMinWidth('<div v-sticky-min-width="enabled">Content</div>', () => ({ enabled: false }));
        expect(mockObserve).not.toHaveBeenCalled();

        await wrapper.setData({ enabled: true });
        expect(mockObserve).toHaveBeenCalledOnce();
    });
});
