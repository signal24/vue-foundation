import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { vAutofocus } from '../autofocus';

describe('v-autofocus', () => {
    it('focuses input element on mount', async () => {
        vi.useFakeTimers();
        const wrapper = mount(
            defineComponent({
                directives: { autofocus: vAutofocus },
                template: '<input v-autofocus />'
            }),
            { attachTo: document.body }
        );

        vi.advanceTimersByTime(20);
        expect(document.activeElement).toBe(wrapper.find('input').element);
        vi.useRealTimers();
    });

    it('focuses nested input inside div', async () => {
        vi.useFakeTimers();
        const wrapper = mount(
            defineComponent({
                directives: { autofocus: vAutofocus },
                template: '<div v-autofocus><input type="text" /></div>'
            }),
            { attachTo: document.body }
        );

        vi.advanceTimersByTime(20);
        expect(document.activeElement).toBe(wrapper.find('input').element);
        vi.useRealTimers();
    });

    it('focuses button element', async () => {
        vi.useFakeTimers();
        const wrapper = mount(
            defineComponent({
                directives: { autofocus: vAutofocus },
                template: '<button v-autofocus>Click</button>'
            }),
            { attachTo: document.body }
        );

        vi.advanceTimersByTime(20);
        expect(document.activeElement).toBe(wrapper.find('button').element);
        vi.useRealTimers();
    });
});
