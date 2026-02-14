import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import VfAjaxSelect from '../vf-ajax-select.vue';

describe('VfAjaxSelect', () => {
    it('shows loading text while options load', () => {
        const loadFn = vi.fn(() => new Promise<string[]>(() => {}));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn }
        });

        expect(wrapper.find('select').element.disabled).toBe(true);
        expect(wrapper.find('option').text()).toBe('Loading...');
    });

    it('uses custom loading text', () => {
        const loadFn = vi.fn(() => new Promise<string[]>(() => {}));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn, loadingText: 'Fetching...' }
        });

        expect(wrapper.find('option').text()).toBe('Fetching...');
    });

    it('renders options after loading', async () => {
        const loadFn = vi.fn(() => Promise.resolve(['Apple', 'Banana', 'Cherry']));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn }
        });

        await flushPromises();
        const options = wrapper.findAll('option');
        expect(options).toHaveLength(3);
        expect(options[0]!.text()).toBe('Apple');
        expect(options[1]!.text()).toBe('Banana');
        expect(options[2]!.text()).toBe('Cherry');
    });

    it('shows null text option when nullText is provided', async () => {
        const loadFn = vi.fn(() => Promise.resolve(['A', 'B']));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn, nullText: '-- Select --' }
        });

        await flushPromises();
        const options = wrapper.findAll('option');
        expect(options).toHaveLength(3);
        expect(options[0]!.text()).toBe('-- Select --');
    });

    it('uses displayKey to render option text', async () => {
        const items = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ];
        const loadFn = vi.fn(() => Promise.resolve(items));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn, displayKey: 'name' }
        });

        await flushPromises();
        const options = wrapper.findAll('option');
        expect(options[0]!.text()).toBe('Alice');
        expect(options[1]!.text()).toBe('Bob');
    });

    it('uses preprocessor to render option text', async () => {
        const items = [
            { first: 'John', last: 'Doe' },
            { first: 'Jane', last: 'Smith' }
        ];
        const loadFn = vi.fn(() => Promise.resolve(items));
        const wrapper = mount(VfAjaxSelect, {
            props: {
                modelValue: null,
                loadFn,
                preprocesor: (opt: { first: string; last: string }) => `${opt.last}, ${opt.first}`
            }
        });

        await flushPromises();
        const options = wrapper.findAll('option');
        expect(options[0]!.text()).toBe('Doe, John');
        expect(options[1]!.text()).toBe('Smith, Jane');
    });

    it('emits update:modelValue when selection changes', async () => {
        const loadFn = vi.fn(() => Promise.resolve(['A', 'B', 'C']));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn }
        });

        await flushPromises();
        await wrapper.find('select').setValue('B');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('reloads when loadFn changes', async () => {
        const loadFn1 = vi.fn(() => Promise.resolve(['A']));
        const loadFn2 = vi.fn(() => Promise.resolve(['X', 'Y']));
        const wrapper = mount(VfAjaxSelect, {
            props: { modelValue: null, loadFn: loadFn1 }
        });

        await flushPromises();
        expect(wrapper.findAll('option')).toHaveLength(1);

        await wrapper.setProps({ loadFn: loadFn2 });
        await flushPromises();
        expect(wrapper.findAll('option')).toHaveLength(2);
        expect(wrapper.findAll('option')[0]!.text()).toBe('X');
    });
});
