import { describe, expect, it, vi } from 'vitest';

import { vAutofocus } from './autofocus';

describe('autofocus directive', () => {
    it('should focus the element', () => {
        vi.useFakeTimers();
        const el = document.createElement('input');
        document.body.appendChild(el);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vAutofocus.mounted!(el, { value: true } as any, null as any, null as any);

        vi.advanceTimersByTime(100);
        expect(document.activeElement).toBe(el);
        vi.useRealTimers();
    });

    it('should focus input inside element', () => {
        vi.useFakeTimers();
        const el = document.createElement('div');
        const input = document.createElement('input');
        el.appendChild(input);
        document.body.appendChild(el);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vAutofocus.mounted!(el, { value: true } as any, null as any, null as any);

        vi.advanceTimersByTime(100);
        expect(document.activeElement).toBe(input);
        vi.useRealTimers();
    });
});
