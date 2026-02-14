import { describe, expect, it, vi } from 'vitest';

import { sleep, sleepSecs } from '../delay';

describe('sleep', () => {
    it('resolves after specified milliseconds', async () => {
        vi.useFakeTimers();
        const promise = sleep(100);
        vi.advanceTimersByTime(100);
        await expect(promise).resolves.toBeUndefined();
        vi.useRealTimers();
    });
});

describe('sleepSecs', () => {
    it('resolves after specified seconds', async () => {
        vi.useFakeTimers();
        const promise = sleepSecs(2);
        vi.advanceTimersByTime(2000);
        await expect(promise).resolves.toBeUndefined();
        vi.useRealTimers();
    });
});
