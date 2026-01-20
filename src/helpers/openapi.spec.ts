import { configureOpenApiClient, OpenApiError } from '@signal24/openapi-client-codegen';
import { describe, expect, it, vi } from 'vitest';

import { configureVfOpenApiClient } from './openapi';

vi.mock('@signal24/openapi-client-codegen', () => ({
    configureOpenApiClient: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OpenApiError: class OpenApiError extends Error {
        response: any;
        body: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(response: any, body: any) {
            super('OpenApiError');
            this.response = response;
            this.body = body;
        }
    }
}));

describe('openapi helper', () => {
    it('should configure client and wrap onError', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = {} as any;
        const options = {
            baseUrl: 'http://test',
            onError: vi.fn()
        };

        configureVfOpenApiClient(client, options);

        expect(configureOpenApiClient).toHaveBeenCalledWith(
            client,
            expect.objectContaining({
                baseUrl: 'http://test',
                onError: expect.any(Function)
            })
        );

        // Get the wrapped onError
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedOnError = (configureOpenApiClient as any).mock.calls[0][1].onError;

        // Test error handling logic
        const err = new OpenApiError({ status: 422 }, { error: 'Validation Error' });
        const result = wrappedOnError(err, {});

        // It should convert to UserError if 422 and body has error string
        // But wrappedOnError calls options.onError, which we mocked.

        expect(options.onError).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const callArg = (options.onError as any).mock.calls[0][0];
        expect(callArg.name).toBe('UserError');
        expect(callArg.message).toBe('Validation Error');
        expect(result).toBe(callArg);
    });
});
