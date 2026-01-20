import { afterEach, describe, expect, it, vi } from 'vitest';

describe('duration directive', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.resetModules();
    });

    it('should show duration', async () => {
        vi.useFakeTimers();
        const { vDuration } = await import('./duration');
        const el = document.createElement('span');
        const startTime = Date.now() - 60000; // 1 minute ago

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDuration.beforeMount!(el, { value: startTime } as any, null as any, null as any);

        expect(el.textContent).toBe('1m 0s');

        // Advance time
        vi.advanceTimersByTime(1100);
        expect(el.textContent).toBe('1m 1s');
    });

    it('should respect no-seconds attribute', async () => {
        vi.useFakeTimers();
        const { vDuration } = await import('./duration');
        const el = document.createElement('span');
        el.setAttribute('no-seconds', '');
        const startTime = Date.now() - 65000; // 1m 5s ago

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDuration.beforeMount!(el, { value: startTime } as any, null as any, null as any);

        expect(el.textContent).toBe('1m'); // seconds ignored
    });

    it('should show - if no value', async () => {
        const { vDuration } = await import('./duration');
        const el = document.createElement('span');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vDuration.beforeMount!(el, { value: 0 } as any, null as any, null as any);
        expect(el.textContent).toBe('-');
    });
});
