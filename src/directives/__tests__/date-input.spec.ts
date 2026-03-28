import { mount } from '@vue/test-utils';
import { format } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { vDateInput } from '../date-input';

function mountDateInput() {
    return mount(
        defineComponent({
            directives: { dateInput: vDateInput },
            template: '<input v-date-input />'
        }),
        { attachTo: document.body }
    );
}

describe('v-date-input', () => {
    it('formats a full date on blur', async () => {
        const wrapper = mountDateInput();
        const input = wrapper.find('input');

        input.element.value = '1/15/2023';
        await input.trigger('blur');

        expect(input.element.value).toBe('01/15/2023');
    });

    it('completes partial MM/DD date with current year', async () => {
        const wrapper = mountDateInput();
        const input = wrapper.find('input');
        const currentYearShort = format(new Date(), 'yy');

        input.element.value = '3/15';
        await input.trigger('blur');

        expect(input.element.value).toBe(`03/15/20${currentYearShort}`);
    });

    it('clears invalid date', async () => {
        const wrapper = mountDateInput();
        const input = wrapper.find('input');

        input.element.value = 'not-a-date';
        await input.trigger('blur');

        expect(input.element.value).toBe('');
    });

    it('clears empty value', async () => {
        const wrapper = mountDateInput();
        const input = wrapper.find('input');

        input.element.value = '';
        await input.trigger('blur');

        expect(input.element.value).toBe('');
    });
});
