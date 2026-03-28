import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { vDisabled } from '../disabled';

function mountDisabled(template: string, data: () => Record<string, unknown>) {
    return mount(
        defineComponent({
            directives: { disabled: vDisabled },
            template,
            data
        }),
        { attachTo: document.body }
    );
}

describe('v-disabled', () => {
    it('disables element when value is true', () => {
        const wrapper = mountDisabled('<button v-disabled="yes">Click</button>', () => ({ yes: true }));
        expect(wrapper.find('button').element.hasAttribute('disabled')).toBe(true);
    });

    it('does not disable element when value is false', () => {
        const wrapper = mountDisabled('<button v-disabled="no">Click</button>', () => ({ no: false }));
        expect(wrapper.find('button').element.hasAttribute('disabled')).toBe(false);
    });

    it('toggles disabled on update', async () => {
        const wrapper = mountDisabled('<button v-disabled="val">Click</button>', () => ({ val: false }));
        expect(wrapper.find('button').element.hasAttribute('disabled')).toBe(false);

        await wrapper.setData({ val: true });
        expect(wrapper.find('button').element.hasAttribute('disabled')).toBe(true);

        await wrapper.setData({ val: false });
        expect(wrapper.find('button').element.hasAttribute('disabled')).toBe(false);
    });

    it('disables nested input inside label', () => {
        const wrapper = mountDisabled('<label v-disabled="val"><input type="text" /></label>', () => ({ val: true }));
        expect(wrapper.find('input').element.hasAttribute('disabled')).toBe(true);
    });

    it('removes disabled on unmount', () => {
        const wrapper = mountDisabled('<button v-disabled="val">Click</button>', () => ({ val: true }));
        const btn = wrapper.find('button').element;
        expect(btn.hasAttribute('disabled')).toBe(true);

        wrapper.unmount();
        expect(btn.hasAttribute('disabled')).toBe(false);
    });
});
