import { afterEach, describe, expect, it, vi } from 'vitest';

import { vHotkey } from './hotkey';

describe('hotkey directive', () => {
    afterEach(() => {
        // vHotkey relies on global window event listener
        // We should ensure it's cleaned up by unmounting elements
    });

    it('should trigger click on hotkey', () => {
        const el = document.createElement('button');
        const clickSpy = vi.spyOn(el, 'click');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vHotkey.mounted!(el, { value: 'a' } as any, null as any, null as any);

        const event = new KeyboardEvent('keydown', { key: 'a' });
        window.dispatchEvent(event);

        expect(clickSpy).toHaveBeenCalled();

        // Cleanup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vHotkey.unmounted!(el, { value: 'a' } as any, null as any, null as any);
    });

    it('should handle case sensitivity', () => {
        const el = document.createElement('button');
        const clickSpy = vi.spyOn(el, 'click');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vHotkey.mounted!(el, { value: 'B' } as any, null as any, null as any);

        // Press 'b' (lowercase)
        const event = new KeyboardEvent('keydown', { key: 'b' });
        window.dispatchEvent(event);

        expect(clickSpy).toHaveBeenCalled();

        // Cleanup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vHotkey.unmounted!(el, { value: 'B' } as any, null as any, null as any);
    });
});
