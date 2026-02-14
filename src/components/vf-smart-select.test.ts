import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VfSmartSelect from './vf-smart-select.vue';

interface Option {
    value: number;
    label: string;
}

const options: Option[] = [
    { value: 1, label: 'Apple' },
    { value: 2, label: 'Banana' },
    { value: 3, label: 'Cherry' },
    { value: 4, label: 'Date' },
    { value: 5, label: 'Elderberry' }
];

describe('VfSmartSelect', () => {
    let wrapper: VueWrapper;

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('renders options when focused', async () => {
        vi.useFakeTimers();
        wrapper = mount(VfSmartSelect, {
            attachTo: document.body,
            props: {
                options,
                labelField: 'label' as unknown as undefined,
                valueField: 'value' as unknown as undefined,
                modelValue: null
            }
        });

        const input = wrapper.find('input');
        await input.trigger('focus');

        vi.runAllTimers();
        await wrapper.vm.$nextTick();

        const optionsContainer = document.querySelector('.vf-smart-select-options') as HTMLElement;
        expect(optionsContainer).not.toBeNull();
        expect(optionsContainer.style.visibility).toBe('visible');

        const optionEls = optionsContainer.querySelectorAll('.option');
        expect(optionEls.length).toBe(5);
        vi.useRealTimers();
    });

    it('filters options', async () => {
        vi.useFakeTimers();
        wrapper = mount(VfSmartSelect, {
            attachTo: document.body,
            props: {
                options,
                labelField: 'label' as unknown as undefined,
                valueField: 'value' as unknown as undefined,
                modelValue: null
            }
        });

        const input = wrapper.find('input');
        await input.trigger('focus');

        vi.runAllTimers();
        await wrapper.vm.$nextTick();

        // Simulate typing 'Ban'
        // We need to trigger keydown to set isSearching = true
        await input.trigger('keydown', { key: 'B' });
        await input.setValue('Ban');

        vi.runAllTimers();
        await wrapper.vm.$nextTick();

        const optionsContainer = document.querySelector('.vf-smart-select-options') as HTMLElement;
        const optionEls = optionsContainer.querySelectorAll('.option');

        expect(optionEls.length).toBe(1);
        expect(optionEls[0]?.textContent).toContain('Banana');
        vi.useRealTimers();
    });
});
