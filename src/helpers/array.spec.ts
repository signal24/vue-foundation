import { describe, expect, it } from 'vitest';

import { replaceElement } from './array';

describe('array helper', () => {
    describe('replaceElement', () => {
        it('should replace an element by value', () => {
            const arr = [1, 2, 3];
            const result = replaceElement(arr, 2, 4);
            expect(result).toBe(true);
            expect(arr).toEqual([1, 4, 3]);
        });

        it('should replace an element by predicate', () => {
            const arr = [{ id: 1 }, { id: 2 }];
            const result = replaceElement(arr, item => item.id === 1, { id: 3 });
            expect(result).toBe(true);
            expect(arr).toEqual([{ id: 3 }, { id: 2 }]);
        });

        it('should return false if element not found', () => {
            const arr = [1, 2, 3];
            const result = replaceElement(arr, 4, 5);
            expect(result).toBe(false);
            expect(arr).toEqual([1, 2, 3]);
        });
    });
});
