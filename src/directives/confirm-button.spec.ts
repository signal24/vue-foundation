import { describe, expect, it, vi } from 'vitest';

import { vConfirmButton } from './confirm-button';

describe('confirm-button directive', () => {
    it('should change text on click and emit confirm on second click', () => {
        vi.useFakeTimers();
        const el = document.createElement('button');
        document.body.appendChild(el);
        el.innerHTML = 'Delete';

        // Mock addEventListener
        // Actually JSDOM supports addEventListener, we can trigger events

        const confirmSpy = vi.fn();
        el.addEventListener('confirm', confirmSpy);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vConfirmButton.mounted!(el, { value: { text: 'Are you sure?' } } as any, null as any, null as any);

        // First click
        const clickEvent = new MouseEvent('click', { bubbles: false, cancelable: true });
        const preventSpy = vi.spyOn(clickEvent, 'preventDefault');
        el.dispatchEvent(clickEvent);

        expect(preventSpy).toHaveBeenCalled();
        expect(el.innerHTML).toBe('Are you sure?');
        expect(confirmSpy).not.toHaveBeenCalled();

        // Second click too fast
        el.dispatchEvent(new MouseEvent('click'));
        expect(confirmSpy).not.toHaveBeenCalled();

        // Advance time
        vi.advanceTimersByTime(301);

        // Second click
        el.dispatchEvent(new MouseEvent('click'));
        expect(confirmSpy).toHaveBeenCalled();
        // Should reset
        expect(el.innerHTML).toBe('Delete');

        vi.useRealTimers();
    });

    it('should reset on mouseout', () => {
        vi.useFakeTimers();
        const el = document.createElement('button');
        document.body.appendChild(el);
        el.innerHTML = 'Delete';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vConfirmButton.mounted!(el, { value: {} } as any, null as any, null as any);

        // Click
        el.dispatchEvent(new MouseEvent('click'));
        expect(el.innerHTML).toBe('Confirm');

        // Mouseout
        el.dispatchEvent(new MouseEvent('mouseout'));
        expect(el.innerHTML).toBe('Delete');

        vi.useRealTimers();
    });
});
