import { describe, expect, it, vi } from 'vitest';

import { sleep, sleepSecs } from './delay';

describe('delay helper', () => {
    it('should sleep for given ms', async () => {
        vi.useFakeTimers();
        const promise = sleep(100);
        vi.advanceTimersByTime(100);
        await expect(promise).resolves.toBeUndefined();
        vi.useRealTimers();
    });

    it('should sleep for given seconds', async () => {
        vi.useFakeTimers();
        const promise = sleepSecs(1);
        vi.advanceTimersByTime(1000);
        await expect(promise).resolves.toBeUndefined();
        vi.useRealTimers();
    });
});
