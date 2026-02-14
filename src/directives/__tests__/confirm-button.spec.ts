import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { vConfirmButton } from '../confirm-button';

function mountConfirmButton(options: { text?: string; class?: string } = {}) {
    const onConfirm = vi.fn();
    const wrapper = mount(
        defineComponent({
            directives: { confirmButton: vConfirmButton },
            template: `<button v-confirm-button="opts" @confirm="onConfirm">Delete</button>`,
            data: () => ({ opts: options }),
            methods: { onConfirm }
        }),
        { attachTo: document.body }
    );
    return { wrapper, onConfirm };
}

describe('v-confirm-button', () => {
    it('changes text on first click and confirms on second click', async () => {
        vi.useFakeTimers();
        const { wrapper, onConfirm } = mountConfirmButton({ text: 'Are you sure?' });
        const btn = wrapper.find('button');

        await btn.trigger('click');
        expect(btn.element.innerHTML).toBe('Are you sure?');
        expect(onConfirm).not.toHaveBeenCalled();

        vi.advanceTimersByTime(301);

        await btn.trigger('click');
        expect(onConfirm).toHaveBeenCalled();
        expect(btn.element.innerHTML).toBe('Delete');

        vi.useRealTimers();
    });

    it('ignores rapid second click within 300ms', async () => {
        vi.useFakeTimers();
        const { wrapper, onConfirm } = mountConfirmButton();
        const btn = wrapper.find('button');

        await btn.trigger('click');
        expect(btn.element.innerHTML).toBe('Confirm');

        vi.advanceTimersByTime(100);
        await btn.trigger('click');
        expect(onConfirm).not.toHaveBeenCalled();

        vi.useRealTimers();
    });

    it('resets on mouseout', async () => {
        vi.useFakeTimers();
        const { wrapper } = mountConfirmButton();
        const btn = wrapper.find('button');

        await btn.trigger('click');
        expect(btn.element.innerHTML).toBe('Confirm');

        await btn.trigger('mouseout');
        expect(btn.element.innerHTML).toBe('Delete');

        vi.useRealTimers();
    });

    it('adds and removes custom class', async () => {
        vi.useFakeTimers();
        const { wrapper } = mountConfirmButton({ text: 'Sure?', class: 'danger' });
        const btn = wrapper.find('button');

        await btn.trigger('click');
        expect(btn.element.classList.contains('danger')).toBe(true);

        await btn.trigger('mouseout');
        expect(btn.element.classList.contains('danger')).toBe(false);

        vi.useRealTimers();
    });

    it('uses default "Confirm" text when text is not specified', async () => {
        vi.useFakeTimers();
        const { wrapper } = mountConfirmButton();
        const btn = wrapper.find('button');

        await btn.trigger('click');
        expect(btn.element.innerHTML).toBe('Confirm');

        vi.useRealTimers();
    });
});
