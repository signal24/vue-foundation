import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { vHotkey } from '../hotkey';

function mountHotkey(key: string, onClick: () => void) {
    return mount(
        defineComponent({
            directives: { hotkey: vHotkey },
            template: `<button v-hotkey="hotkey" @click="onClick">Btn</button>`,
            data: () => ({ hotkey: key }),
            methods: { onClick }
        }),
        { attachTo: document.body }
    );
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('v-hotkey', () => {
    it('triggers click on matching keydown', () => {
        const onClick = vi.fn();
        mountHotkey('a', onClick);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('is case-insensitive', () => {
        const onClick = vi.fn();
        mountHotkey('B', onClick);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('does not trigger on non-matching key', () => {
        const onClick = vi.fn();
        mountHotkey('a', onClick);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('cleans up on unmount', () => {
        const onClick = vi.fn();
        const wrapper = mountHotkey('a', onClick);

        wrapper.unmount();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('last registered takes priority', () => {
        const first = vi.fn();
        const second = vi.fn();
        mountHotkey('a', first);
        mountHotkey('a', second);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        expect(second).toHaveBeenCalledOnce();
        expect(first).not.toHaveBeenCalled();
    });
});
