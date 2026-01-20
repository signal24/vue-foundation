import { describe, expect, it } from 'vitest';

import { vDateInput } from './date-input';

describe('date-input directive', () => {
    it('should format date on blur', () => {
        const el = document.createElement('input');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDateInput.beforeMount!(el, {} as any, null as any, null as any);

        el.value = '1/1/23';
        el.dispatchEvent(new Event('blur'));

        expect(el.value).toBe('01/01/2023');
    });

    it('should clear invalid date', () => {
        const el = document.createElement('input');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDateInput.beforeMount!(el, {} as any, null as any, null as any);

        el.value = 'invalid';
        el.dispatchEvent(new Event('blur'));

        expect(el.value).toBe('');
    });
});
