import { describe, expect, it } from 'vitest';

import { cloneProp, extractUpdates, nullifyEmptyInputs, patchObject } from './object';

describe('object helper', () => {
    describe('cloneProp', () => {
        it('should clone existing property', () => {
            const obj = { a: 1 };
            const cloned = cloneProp(obj, { a: 2 });
            expect(cloned).toEqual({ a: 1 });
            expect(cloned).not.toBe(obj);
        });

        it('should use fallback if prop is null/undefined', () => {
            expect(cloneProp(null, { a: 1 })).toEqual({ a: 1 });
            expect(cloneProp(undefined, { a: 1 })).toEqual({ a: 1 });
        });
    });

    describe('nullifyEmptyInputs', () => {
        it('should nullify empty strings', () => {
            const obj = { a: '', b: 'test', c: '' };
            const result = nullifyEmptyInputs(obj, ['a', 'c']);
            expect(result).toEqual({ a: null, b: 'test', c: null });
        });
    });

    describe('extractUpdates', () => {
        it('should extract changed values', () => {
            const state = { a: 1, b: 2 };
            const updates = { a: 3, b: 2 };
            const result = extractUpdates(state, updates);
            expect(result).toEqual({ a: 3 });
        });
    });

    describe('patchObject', () => {
        it('should patch object with updates', () => {
            const state = { a: 1, b: 2 };
            const updates = { a: 3, b: 2 };
            patchObject(state, updates);
            expect(state).toEqual({ a: 3, b: 2 });
        });
    });
});
