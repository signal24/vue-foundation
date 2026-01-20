import { describe, expect, it } from 'vitest';

import { desnakeCase, formatPhone, formatUSCurrency, nl2br, uuid } from './string';

describe('string helper', () => {
    describe('nl2br', () => {
        it('should replace newlines with <br>', () => {
            expect(nl2br('hello\nworld')).toBe('hello<br>world');
            expect(nl2br('foo\nbar\nbaz')).toBe('foo<br>bar<br>baz');
        });
    });

    describe('desnakeCase', () => {
        it('should replace underscores with spaces', () => {
            expect(desnakeCase('hello_world')).toBe('hello world');
            expect(desnakeCase('foo_bar_baz')).toBe('foo bar baz');
        });
    });

    describe('formatPhone', () => {
        it('should format 10 digit phone number', () => {
            // Use 555 area code to avoid leading 1 removal logic
            expect(formatPhone('5554567890')).toBe('(555) 456-7890');
        });

        it('should handle non-digit characters', () => {
            expect(formatPhone('(555) 456-7890')).toBe('(555) 456-7890');
            expect(formatPhone('555-456-7890')).toBe('(555) 456-7890');
        });

        it('should remove leading 1', () => {
            expect(formatPhone('15554567890')).toBe('(555) 456-7890');
        });

        it('should return original if not 10 digits', () => {
            expect(formatPhone('123')).toBe('123');
        });
    });

    describe('formatUSCurrency', () => {
        it('should format currency', () => {
            expect(formatUSCurrency(1234.56)).toBe('$1,234.56');
            expect(formatUSCurrency('1234.56')).toBe('$1,234.56');
        });

        it('should handle divisor', () => {
            expect(formatUSCurrency(100, 100)).toBe('$1.00');
        });
    });

    describe('uuid', () => {
        it('should generate a uuid', () => {
            const id = uuid();
            expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });
    });
});
