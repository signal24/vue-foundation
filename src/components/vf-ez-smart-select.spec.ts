import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import VfEzSmartSelect from './vf-ez-smart-select.vue';

describe('VfEzSmartSelect', () => {
    it('adapts array options to smart select', async () => {
        const options = ['A', 'B'];
        const wrapper = mount(VfEzSmartSelect, {
            props: {
                modelValue: null,
                options
            }
        });

        // Check if internal VfSmartSelect received computed options
        const smartSelect = wrapper.findComponent({ name: 'VfSmartSelect' });
        expect(smartSelect.exists()).toBe(true);
        expect(smartSelect.props('options')).toEqual([
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' }
        ]);
    });

    it('adapts object options to smart select', async () => {
        const options = { a: 'Label A', b: 'Label B' };
        const wrapper = mount(VfEzSmartSelect, {
            props: {
                modelValue: null,
                options
            }
        });

        const smartSelect = wrapper.findComponent({ name: 'VfSmartSelect' });
        expect(smartSelect.props('options')).toEqual([
            { value: 'a', label: 'Label A' },
            { value: 'b', label: 'Label B' }
        ]);
    });
});
