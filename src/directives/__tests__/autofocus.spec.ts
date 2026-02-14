import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { vAutofocus } from '../autofocus';

function expectAutofocus(template: string, selector: string) {
    vi.useFakeTimers();
    const wrapper = mount(
        defineComponent({
            directives: { autofocus: vAutofocus },
            template
        }),
        { attachTo: document.body }
    );
    vi.advanceTimersByTime(20);
    expect(document.activeElement).toBe(wrapper.find(selector).element);
    vi.useRealTimers();
}

describe('v-autofocus', () => {
    it('focuses input element on mount', () => {
        expectAutofocus('<input v-autofocus />', 'input');
    });

    it('focuses nested input inside div', () => {
        expectAutofocus('<div v-autofocus><input type="text" /></div>', 'input');
    });

    it('focuses button element', () => {
        expectAutofocus('<button v-autofocus>Click</button>', 'button');
    });
});
