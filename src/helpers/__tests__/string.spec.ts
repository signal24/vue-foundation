import { describe, expect, it } from 'vitest';

import { desnakeCase, formatPhone, formatUSCurrency, nl2br, uuid } from '../string';

describe('nl2br', () => {
    it('converts newlines to <br>', () => {
        expect(nl2br('hello\nworld')).toBe('hello<br>world');
    });

    it('handles multiple newlines', () => {
        expect(nl2br('a\nb\nc')).toBe('a<br>b<br>c');
    });

    it('returns unchanged string with no newlines', () => {
        expect(nl2br('hello')).toBe('hello');
    });
});

describe('desnakeCase', () => {
    it('replaces underscores with spaces', () => {
        expect(desnakeCase('hello_world')).toBe('hello world');
    });

    it('handles multiple underscores', () => {
        expect(desnakeCase('foo_bar_baz')).toBe('foo bar baz');
    });

    it('returns unchanged string with no underscores', () => {
        expect(desnakeCase('hello')).toBe('hello');
    });
});

describe('formatPhone', () => {
    it('formats 10-digit number', () => {
        expect(formatPhone('5551234567')).toBe('(555) 123-4567');
    });

    it('strips non-digit characters', () => {
        expect(formatPhone('(555) 123-4567')).toBe('(555) 123-4567');
        expect(formatPhone('555-123-4567')).toBe('(555) 123-4567');
    });

    it('strips leading 1', () => {
        expect(formatPhone('15551234567')).toBe('(555) 123-4567');
    });

    it('returns original if not 10 digits after cleaning', () => {
        expect(formatPhone('123')).toBe('123');
        expect(formatPhone('123456789012')).toBe('123456789012');
    });
});

describe('formatUSCurrency', () => {
    it('formats number as currency', () => {
        expect(formatUSCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats string as currency', () => {
        expect(formatUSCurrency('99.99')).toBe('$99.99');
    });

    it('applies divisor', () => {
        expect(formatUSCurrency(10000, 100)).toBe('$100.00');
    });

    it('formats zero', () => {
        expect(formatUSCurrency(0)).toBe('$0.00');
    });

    it('formats negative values', () => {
        expect(formatUSCurrency(-50)).toBe('-$50.00');
    });
});

describe('uuid', () => {
    it('returns a valid v4 UUID', () => {
        const id = uuid();
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('returns unique values', () => {
        expect(uuid()).not.toBe(uuid());
    });
});
