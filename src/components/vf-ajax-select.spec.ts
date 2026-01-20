import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import VfAjaxSelect from './vf-ajax-select.vue';

describe('VfAjaxSelect', () => {
    it('loads data on mount', async () => {
        const loadFn = vi.fn().mockResolvedValue(['A', 'B']);
        const wrapper = mount(VfAjaxSelect, {
            props: {
                modelValue: null,
                loadFn
            }
        });

        expect(wrapper.text()).toContain('Loading...');

        await flushPromises();

        expect(wrapper.text()).not.toContain('Loading...');
        expect(wrapper.findAll('option')).toHaveLength(2);

        // Check html content directly
        expect(wrapper.html()).toContain('<option value="A">A</option>');
        expect(wrapper.html()).toContain('<option value="B">B</option>');
    });
});
