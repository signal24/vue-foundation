import { describe, expect, it } from 'vitest';

import { formatNumber } from '../number';

describe('formatNumber', () => {
    it('adds thousand separators', () => {
        expect(formatNumber(1000)).toBe('1,000');
        expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('leaves small numbers unchanged', () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(999)).toBe('999');
    });

    it('preserves decimals', () => {
        expect(formatNumber(12345.67)).toBe('12,345.67');
    });

    it('handles negative numbers', () => {
        expect(formatNumber(-1000)).toBe('-1,000');
    });
});
