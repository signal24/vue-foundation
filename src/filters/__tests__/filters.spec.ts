import { describe, expect, it } from 'vitest';

import { createFilters } from '../index';

const filters = createFilters(() => ({}));

describe('createFilters', () => {
    it('merges custom filters with base filters', () => {
        const custom = createFilters(() => ({ custom: (v: string) => v.toUpperCase() }));
        expect(custom.custom('hello')).toBe('HELLO');
        expect(custom.bytes).toBeDefined();
    });
});

describe('bytes', () => {
    it('formats bytes', () => {
        expect(filters.bytes(100)).toBe('100.00 B');
    });

    it('formats kilobytes', () => {
        expect(filters.bytes(1024)).toBe('1.00 KB');
    });

    it('formats megabytes', () => {
        expect(filters.bytes(1024 * 1024)).toBe('1.00 MB');
    });

    it('formats gigabytes', () => {
        expect(filters.bytes(1024 ** 3)).toBe('1.00 GB');
    });

    it('formats terabytes', () => {
        expect(filters.bytes(1024 ** 4)).toBe('1.00 TB');
    });
});

describe('dash', () => {
    it('returns dash for null', () => {
        expect(filters.dash(null)).toBe('-');
    });

    it('returns dash for undefined', () => {
        expect(filters.dash(undefined)).toBe('-');
    });

    it('returns dash for empty string', () => {
        expect(filters.dash('')).toBe('-');
    });

    it('passes through non-empty values', () => {
        expect(filters.dash('hello')).toBe('hello');
        expect(filters.dash(0)).toBe(0);
        expect(filters.dash(false)).toBe(false);
    });
});

describe('dashZeros', () => {
    it('returns dash for zero', () => {
        expect(filters.dashZeros(0)).toBe('-');
    });

    it('returns dash for null', () => {
        expect(filters.dashZeros(null)).toBe('-');
    });

    it('passes through non-zero numbers', () => {
        expect(filters.dashZeros(42)).toBe(42);
    });
});

describe('number', () => {
    it('formats numbers with commas', () => {
        expect(filters.number(1000)).toBe('1,000');
        expect(filters.number('1000')).toBe('1,000');
    });

    it('returns null for null', () => {
        expect(filters.number(null)).toBeNull();
    });

    it('returns non-numeric strings unchanged', () => {
        expect(filters.number('abc')).toBe('abc');
    });
});

describe('phone', () => {
    it('formats phone numbers', () => {
        expect(filters.phone('5551234567')).toBe('(555) 123-4567');
    });

    it('returns null for null', () => {
        expect(filters.phone(null)).toBeNull();
    });
});

describe('casing filters', () => {
    it('upperFirst', () => {
        expect(filters.upperFirst('hello')).toBe('Hello');
        expect(filters.upperFirst(null)).toBeNull();
    });

    it('startCase', () => {
        expect(filters.startCase('helloWorld')).toBe('Hello World');
        expect(filters.startCase(null)).toBeNull();
    });

    it('upperCase', () => {
        expect(filters.upperCase('hello')).toBe('HELLO');
        expect(filters.upperCase(null)).toBeNull();
    });

    it('upperWords', () => {
        expect(filters.upperWords('hello world')).toBe('Hello World');
        expect(filters.upperWords(null)).toBeNull();
    });

    it('desnake', () => {
        expect(filters.desnake('hello_world')).toBe('hello world');
        expect(filters.desnake(null)).toBeNull();
    });
});

describe('usCurrency', () => {
    it('formats as US currency', () => {
        expect(filters.usCurrency(100)).toBe('$100.00');
    });

    it('applies divisor', () => {
        expect(filters.usCurrency(10000, 100)).toBe('$100.00');
    });
});

describe('divide', () => {
    it('divides values', () => {
        expect(filters.divide(100, 10)).toBe(10);
    });

    it('handles decimal results', () => {
        expect(filters.divide(1, 3)).toBeCloseTo(0.33, 1);
    });
});

describe('date/time filters', () => {
    it('formats date', () => {
        expect(filters.date('2023-06-15T12:00:00')).toBe('6/15/23');
    });

    it('formats date with custom format', () => {
        expect(filters.date('2023-06-15T12:00:00', 'yyyy-MM-dd')).toBe('2023-06-15');
    });

    it('returns null for null date', () => {
        expect(filters.date(null)).toBeNull();
    });

    it('formats time', () => {
        expect(filters.time('2023-06-15T14:30:00')).toBe('14:30');
    });

    it('returns null for null time', () => {
        expect(filters.time(null)).toBeNull();
    });

    it('formats dateTime', () => {
        expect(filters.dateTime('2023-06-15T14:30:00')).toBe('6/15/23 14:30');
    });

    it('returns null for null dateTime', () => {
        expect(filters.dateTime(null)).toBeNull();
    });

    it('oneDayForward adds one day', () => {
        expect(filters.oneDayForward('2023-01-01')).toBe('1/2/23');
    });

    it('oneDayForward returns null for null', () => {
        expect(filters.oneDayForward(null)).toBeNull();
    });

    it('oneDayForward returns undefined for undefined', () => {
        expect(filters.oneDayForward(undefined)).toBeUndefined();
    });
});
