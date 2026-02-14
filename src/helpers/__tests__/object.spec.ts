import { describe, expect, it } from 'vitest';

import {
    cloneProp,
    extractKV,
    extractUpdates,
    extractValues,
    isNotNullOrUndefined,
    nullifyEmptyInputs,
    objectAssign,
    objectEntries,
    objectKeys,
    patchObject
} from '../object';

describe('cloneProp', () => {
    it('deep clones a non-null value', () => {
        const obj = { a: { b: 1 } };
        const cloned = cloneProp(obj, { a: { b: 2 } });
        expect(cloned).toEqual({ a: { b: 1 } });
        expect(cloned).not.toBe(obj);
        expect(cloned.a).not.toBe(obj.a);
    });

    it('returns fallback when null', () => {
        const fallback = { x: 1 };
        expect(cloneProp(null, fallback)).toBe(fallback);
    });

    it('returns fallback when undefined', () => {
        const fallback = { x: 1 };
        expect(cloneProp(undefined, fallback)).toBe(fallback);
    });
});

describe('nullifyEmptyInputs', () => {
    it('converts empty strings to null for specified fields', () => {
        const result = nullifyEmptyInputs({ a: '', b: 'test', c: '' }, ['a', 'c']);
        expect(result).toEqual({ a: null, b: 'test', c: null });
    });

    it('does not modify non-empty fields', () => {
        const result = nullifyEmptyInputs({ a: 'hello', b: '' }, ['a']);
        expect(result).toEqual({ a: 'hello', b: '' });
    });

    it('returns a new object', () => {
        const original = { a: '' };
        const result = nullifyEmptyInputs(original, ['a']);
        expect(result).not.toBe(original);
    });
});

describe('isNotNullOrUndefined', () => {
    it('returns true for values', () => {
        expect(isNotNullOrUndefined(0)).toBe(true);
        expect(isNotNullOrUndefined('')).toBe(true);
        expect(isNotNullOrUndefined(false)).toBe(true);
    });

    it('returns false for null and undefined', () => {
        expect(isNotNullOrUndefined(null)).toBe(false);
        expect(isNotNullOrUndefined(undefined)).toBe(false);
    });
});

describe('objectKeys', () => {
    it('returns typed keys', () => {
        expect(objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    });
});

describe('objectAssign', () => {
    it('merges objects', () => {
        const target = { a: 1, b: 2 };
        objectAssign(target, { b: 3 });
        expect(target).toEqual({ a: 1, b: 3 });
    });
});

describe('objectEntries', () => {
    it('returns typed entries', () => {
        expect(objectEntries({ a: 1, b: 2 })).toEqual([
            ['a', 1],
            ['b', 2]
        ]);
    });
});

describe('extractValues', () => {
    it('picks specified fields', () => {
        const state = { a: 1, b: 2, c: 3 };
        expect(extractValues(state, ['a', 'c'] as const)).toEqual({ a: 1, c: 3 });
    });

    it('skips undefined fields', () => {
        const state = { a: 1, b: undefined } as { a: number; b: number | undefined };
        expect(extractValues(state, ['a', 'b'] as const)).toEqual({ a: 1 });
    });
});

describe('extractUpdates', () => {
    it('returns only changed fields', () => {
        const state = { a: 1, b: 2, c: 3 };
        const updates = { a: 1, b: 99, c: 3 };
        expect(extractUpdates(state, updates)).toEqual({ b: 99 });
    });

    it('returns empty object when nothing changed', () => {
        const state = { a: 1 };
        expect(extractUpdates(state, { a: 1 })).toEqual({});
    });

    it('respects fields filter', () => {
        const state = { a: 1, b: 2 };
        const updates = { a: 99, b: 99 };
        expect(extractUpdates(state, updates, ['a'])).toEqual({ a: 99 });
    });

    it('uses deep equality by default', () => {
        const state = { a: { x: 1 } };
        const updates = { a: { x: 1 } };
        expect(extractUpdates(state, updates)).toEqual({});
    });

    it('supports matches mode for partial matching', () => {
        const state = { a: { x: 1, y: 2 } };
        const updates = { a: { x: 1 } };
        expect(extractUpdates(state, updates, undefined, 'matches')).toEqual({});
    });

    it('detects changes in matches mode', () => {
        const state = { a: { x: 1, y: 2 } };
        const updates = { a: { x: 99 } };
        expect(extractUpdates(state, updates, undefined, 'matches')).toEqual({ a: { x: 99 } });
    });
});

describe('patchObject', () => {
    it('applies changed fields to state', () => {
        const state = { a: 1, b: 2 };
        const result = patchObject(state, { a: 99, b: 2 });
        expect(result).toBe(state);
        expect(state.a).toBe(99);
    });

    it('does not modify unchanged fields', () => {
        const state = { a: 1, b: 2 };
        patchObject(state, { a: 1, b: 2 });
        expect(state).toEqual({ a: 1, b: 2 });
    });
});

describe('extractKV', () => {
    it('converts array to key-value object', () => {
        const arr = [
            { id: 'a', name: 'Alice' },
            { id: 'b', name: 'Bob' }
        ];
        expect(extractKV(arr, 'id', 'name')).toEqual({ a: 'Alice', b: 'Bob' });
    });

    it('handles empty array', () => {
        expect(extractKV([], 'id' as never, 'name' as never)).toEqual({});
    });
});
