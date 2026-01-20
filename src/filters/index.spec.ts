import { describe, expect, it } from 'vitest';

import { createFilters } from './index';

describe('filters', () => {
    const filters = createFilters(() => ({}));

    describe('bytes', () => {
        it('should format bytes', () => {
            expect(filters.bytes(100)).toBe('100.00 B');
            expect(filters.bytes(1024)).toBe('1.00 KB');
            expect(filters.bytes(1024 * 1024)).toBe('1.00 MB');
        });
    });

    describe('dash', () => {
        it('should return dash for empty/null', () => {
            expect(filters.dash(null)).toBe('-');
            expect(filters.dash(undefined)).toBe('-');
            expect(filters.dash('')).toBe('-');
            expect(filters.dash('val')).toBe('val');
            expect(filters.dash(0)).toBe(0);
        });
    });

    describe('dashZeros', () => {
        it('should return dash for zero/null', () => {
            expect(filters.dashZeros(0)).toBe('-');
            expect(filters.dashZeros(null)).toBe('-');
            expect(filters.dashZeros(10)).toBe(10);
        });
    });

    describe('number', () => {
        it('should format number', () => {
            expect(filters.number(1000)).toBe('1,000');
            expect(filters.number('1000')).toBe('1,000');
            expect(filters.number('abc')).toBe('abc');
            expect(filters.number(null)).toBe(null);
        });
    });

    describe('phone', () => {
        it('should format phone', () => {
            expect(filters.phone('5551234567')).toBe('(555) 123-4567');
        });
    });

    describe('casing', () => {
        it('should upperFirst', () => {
            expect(filters.upperFirst('hello')).toBe('Hello');
            expect(filters.upperFirst(null)).toBe(null);
        });

        it('should startCase', () => {
            expect(filters.startCase('helloWorld')).toBe('Hello World');
        });

        it('should upperCase', () => {
            expect(filters.upperCase('hello')).toBe('HELLO');
        });

        it('should upperWords', () => {
            expect(filters.upperWords('hello world')).toBe('Hello World');
        });

        it('should desnake', () => {
            expect(filters.desnake('hello_world')).toBe('hello world');
        });
    });

    describe('currency', () => {
        it('should format usCurrency', () => {
            expect(filters.usCurrency(100)).toBe('$100.00');
        });

        it('should divide', () => {
            expect(filters.divide(100, 10)).toBe(10);
        });
    });

    describe('date/time', () => {
        // Mocking date logic or testing simple formatting
        const dateStr = '2023-01-01T12:00:00';

        it('should format date', () => {
            // using default format M/d/yy -> 1/1/23
            expect(filters.date(dateStr)).toBe('1/1/23');
        });

        it('should format time', () => {
            // using default format H:mm -> 12:00
            expect(filters.time(dateStr)).toBe('12:00');
        });

        it('should format dateTime', () => {
            expect(filters.dateTime(dateStr)).toBe('1/1/23 12:00');
        });

        it('should add one day', () => {
            // oneDayForward expects yyyy-MM-dd
            expect(filters.oneDayForward('2023-01-01')).toBe('1/2/23');
        });
    });
});
