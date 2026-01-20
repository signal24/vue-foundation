import { describe, expect, it, vi } from 'vitest';

import { showAlert } from '../components/alert-helpers';
import { VfOptions } from '../config';
import { formatError, handleErrorAndAlert, UserError } from './error';

vi.mock('../components/alert-helpers', () => ({
    showAlert: vi.fn()
}));

describe('error helper', () => {
    describe('formatError', () => {
        it('should format UserError', () => {
            const err = new UserError('My Error');
            expect(formatError(err)).toBe('My Error');
        });

        it('should format other errors', () => {
            const err = new Error('System Error');
            const msg = formatError(err);
            expect(msg).toContain('An application error has occurred');
            expect(msg).toContain('System Error');
        });
    });

    describe('handleErrorAndAlert', () => {
        it('should handle UserError', async () => {
            const err = new UserError('My Error');
            await handleErrorAndAlert(err);
            expect(showAlert).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: err
                })
            );
        });

        it('should handle system error and call global error handler', async () => {
            const err = new Error('System Error');
            const errorHandlerSpy = vi.spyOn(VfOptions, 'errorHandler');

            await handleErrorAndAlert(err);

            expect(errorHandlerSpy).toHaveBeenCalledWith(expect.any(Error));
            expect(showAlert).toHaveBeenCalled();

            errorHandlerSpy.mockRestore();
        });
    });
});
