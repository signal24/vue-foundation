import { describe, expect, it } from 'vitest';

import { formatNumber } from './number';

describe('number helper', () => {
    describe('formatNumber', () => {
        it('should format number with commas', () => {
            expect(formatNumber(100)).toBe('100');
            expect(formatNumber(1000)).toBe('1,000');
            expect(formatNumber(1000000)).toBe('1,000,000');
            expect(formatNumber(12345.67)).toBe('12,345.67');
        });
    });
});
