import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it } from 'vitest';

import { vReadonly } from '../readonly';

function mountReadonly(template: string, data: () => Record<string, unknown>) {
    return mount(
        defineComponent({
            directives: { readonly: vReadonly },
            template,
            data
        }),
        { attachTo: document.body }
    );
}

describe('v-readonly', () => {
    it('sets readonly when value is true', () => {
        const wrapper = mountReadonly('<input v-readonly="val" />', () => ({ val: true }));
        expect(wrapper.find('input').element.hasAttribute('readonly')).toBe(true);
    });

    it('does not set readonly when value is false', () => {
        const wrapper = mountReadonly('<input v-readonly="val" />', () => ({ val: false }));
        expect(wrapper.find('input').element.hasAttribute('readonly')).toBe(false);
    });

    it('toggles readonly on update', async () => {
        const wrapper = mountReadonly('<input v-readonly="val" />', () => ({ val: false }));
        await wrapper.setData({ val: true });
        expect(wrapper.find('input').element.hasAttribute('readonly')).toBe(true);

        await wrapper.setData({ val: false });
        expect(wrapper.find('input').element.hasAttribute('readonly')).toBe(false);
    });

    it('sets readonly on nested input inside label', () => {
        const wrapper = mountReadonly('<label v-readonly="val"><input type="text" /></label>', () => ({ val: true }));
        expect(wrapper.find('input').element.hasAttribute('readonly')).toBe(true);
    });
});
