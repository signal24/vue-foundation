import { describe, expect, it, vi } from 'vitest';

import { VfOptions } from '../../config';
import { formatError, handleError, isError, toError, UserError } from '../error';

vi.mock('../../components/alert-helpers', () => ({
    showAlert: vi.fn().mockResolvedValue(undefined)
}));

describe('UserError', () => {
    it('is an instance of Error', () => {
        const err = new UserError('test');
        expect(err).toBeInstanceOf(Error);
        expect(err.name).toBe('UserError');
        expect(err.message).toBe('test');
    });
});

describe('isError', () => {
    it('returns true for Error instances', () => {
        expect(isError(new Error('test'))).toBe(true);
        expect(isError(new UserError('test'))).toBe(true);
        expect(isError(new TypeError('test'))).toBe(true);
    });

    it('returns true for error-like objects', () => {
        expect(isError({ message: 'msg', name: 'Err' })).toBe(true);
    });

    it('returns false for non-errors', () => {
        expect(isError('string')).toBe(false);
        expect(isError(42)).toBe(false);
        expect(isError(null)).toBe(false);
        expect(isError(undefined)).toBe(false);
        expect(isError({})).toBe(false);
        expect(isError({ message: 'msg' })).toBe(false);
    });
});

describe('toError', () => {
    it('returns Error instances unchanged', () => {
        const err = new Error('test');
        expect(toError(err)).toBe(err);
    });

    it('wraps non-Error values', () => {
        const err = toError('something broke');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('something broke');
    });

    it('attaches cause', () => {
        const err = toError('main', 'cause');
        expect(err.cause).toBeInstanceOf(Error);
        expect(err.cause!.message).toBe('cause');
    });
});

describe('formatError', () => {
    it('returns message directly for UserError', () => {
        expect(formatError(new UserError('Bad input'))).toBe('Bad input');
    });

    it('wraps other errors with support text', () => {
        const msg = formatError(new Error('ECONNREFUSED'));
        expect(msg).toContain('An application error has occurred');
        expect(msg).toContain('ECONNREFUSED');
        expect(msg).toContain(VfOptions.unhandledErrorSupportText);
    });

    it('handles non-Error values', () => {
        const msg = formatError('string error');
        expect(msg).toContain('string error');
    });
});

describe('handleError', () => {
    it('calls errorHandler for non-UserErrors', async () => {
        const spy = vi.fn();
        VfOptions.errorHandler = spy;
        await handleError(new Error('system'));
        expect(spy).toHaveBeenCalledWith(expect.any(Error));
    });

    it('does not call errorHandler for UserErrors', async () => {
        const spy = vi.fn();
        VfOptions.errorHandler = spy;
        await handleError(new UserError('user'));
        expect(spy).not.toHaveBeenCalled();
    });
});
