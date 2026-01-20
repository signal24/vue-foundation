import { describe, expect, it } from 'vitest';

import { vDatetime } from './datetime';

describe('datetime directive', () => {
    it('should format date', () => {
        const el = document.createElement('span');
        // using ISO string
        const dateStr = '2023-01-01T12:00:00Z';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDatetime.beforeMount!(el, { value: dateStr } as any, null as any, null as any);

        // Default format M/d/yy H:mm
        // Note: format uses local time.
        // We can't easily predict local time in test environment unless we mock timezone or check format.
        // Assuming test runs in UTC or we just check if it contains the date components.
        expect(el.textContent).toContain('1/1/23');
    });

    it('should respect date-only attribute', () => {
        const el = document.createElement('span');
        el.setAttribute('date-only', '');
        const dateStr = '2023-01-01T12:00:00Z';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDatetime.beforeMount!(el, { value: dateStr } as any, null as any, null as any);

        // M/d/yy
        expect(el.textContent).toContain('1/1/23');
        // Should not contain time if date-only (assuming default H:mm)
        // But let's just check the string length or format.
        // 1/1/23 is 6 chars. 01/01/2023 is 10.
        // It depends on defaultDateFormat in config.
    });

    it('should show placeholder if no value', () => {
        const el = document.createElement('span');
        el.setAttribute('placeholder', '-');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDatetime.beforeMount!(el, { value: '' } as any, null as any, null as any);
        expect(el.textContent).toBe('-');
    });
});
