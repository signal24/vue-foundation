import { describe, expect, it } from 'vitest';

import { replaceElement } from '../array';

describe('replaceElement', () => {
    it('replaces by reference', () => {
        const arr = [1, 2, 3];
        expect(replaceElement(arr, 2, 99)).toBe(true);
        expect(arr).toEqual([1, 99, 3]);
    });

    it('replaces by predicate', () => {
        const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const replacement = { id: 42 };
        expect(replaceElement(arr, item => item.id === 2, replacement)).toBe(true);
        expect(arr[1]).toBe(replacement);
    });

    it('returns false when element not found by reference', () => {
        const arr = [1, 2, 3];
        expect(replaceElement(arr, 5, 99)).toBe(false);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('returns false when predicate matches nothing', () => {
        const arr = [{ id: 1 }];
        expect(replaceElement(arr, item => item.id === 999, { id: 0 })).toBe(false);
        expect(arr).toEqual([{ id: 1 }]);
    });

    it('replaces first occurrence only', () => {
        const arr = [1, 2, 2, 3];
        replaceElement(arr, 2, 99);
        expect(arr).toEqual([1, 99, 2, 3]);
    });
});
