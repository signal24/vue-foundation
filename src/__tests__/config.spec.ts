import { describe, expect, it } from 'vitest';

import { configureVf, VfOptions } from '../config';

describe('VfOptions defaults', () => {
    it('has expected default values', () => {
        expect(VfOptions.unhandledErrorSupportText).toBe('please contact support');
        expect(VfOptions.defaultDateFormat).toBe('M/d/yy');
        expect(VfOptions.defaultTimeFormat).toBe('H:mm');
        expect(VfOptions.defaultCurrencyDivisor).toBe(1);
        expect(VfOptions.errorHandler).toBeTypeOf('function');
    });
});

describe('configureVf', () => {
    it('merges partial options', () => {
        configureVf({ defaultDateFormat: 'yyyy-MM-dd' });
        expect(VfOptions.defaultDateFormat).toBe('yyyy-MM-dd');
        expect(VfOptions.defaultTimeFormat).toBe('H:mm');
    });

    it('overwrites existing options', () => {
        configureVf({ defaultCurrencyDivisor: 100 });
        expect(VfOptions.defaultCurrencyDivisor).toBe(100);
    });
});
