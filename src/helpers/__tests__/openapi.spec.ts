import { configureOpenApiClient, OpenApiError } from '@signal24/openapi-client-codegen';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserError } from '../error';
import { configureVfOpenApiClient } from '../openapi';

vi.mock('@signal24/openapi-client-codegen', () => ({
    configureOpenApiClient: vi.fn(),
    OpenApiError: class MockOpenApiError extends Error {
        response: { status: number };
        body: unknown;
        constructor(response: { status: number }, body: unknown) {
            super('OpenApiError');
            this.name = 'OpenApiError';
            this.response = response;
            this.body = body;
        }
    }
}));

const mockedConfigure = vi.mocked(configureOpenApiClient);

function getWrappedOnError() {
    const lastCall = mockedConfigure.mock.calls.at(-1)!;
    return lastCall[1].onError! as (error: unknown, options: unknown) => unknown;
}

describe('configureVfOpenApiClient', () => {
    beforeEach(() => {
        mockedConfigure.mockClear();
    });

    it('passes options through to configureOpenApiClient', () => {
        const client = {} as never;
        const options = { baseUrl: 'https://test', onError: vi.fn() };
        configureVfOpenApiClient(client, options as never);

        expect(mockedConfigure).toHaveBeenCalledWith(client, expect.objectContaining({ baseUrl: 'https://test' }));
    });

    it('converts 422 errors with string body.error to UserError', () => {
        const onError = vi.fn();
        configureVfOpenApiClient({} as never, { onError } as never);

        const wrappedOnError = getWrappedOnError();
        const err = new OpenApiError({ status: 422 } as never, { error: 'Validation failed' } as never);
        wrappedOnError(err, {});

        expect(onError).toHaveBeenCalled();
        const passedErr = onError.mock.calls[0][0];
        expect(passedErr).toBeInstanceOf(UserError);
        expect(passedErr.message).toBe('Validation failed');
    });

    it('passes non-422 errors through to onError', () => {
        const onError = vi.fn();
        configureVfOpenApiClient({} as never, { onError } as never);

        const wrappedOnError = getWrappedOnError();
        const err = new OpenApiError({ status: 500 } as never, { error: 'Server error' } as never);
        wrappedOnError(err, {});

        expect(onError).toHaveBeenCalledWith(err, {});
    });

    it('returns err when onError returns undefined', () => {
        const onError = vi.fn().mockReturnValue(undefined);
        configureVfOpenApiClient({} as never, { onError } as never);

        const wrappedOnError = getWrappedOnError();
        const err = new Error('generic');
        const result = wrappedOnError(err, {});

        expect(result).toBe(err);
    });

    it('returns onError result when it returns a value', () => {
        const replacement = new Error('replaced');
        const onError = vi.fn().mockReturnValue(replacement);
        configureVfOpenApiClient({} as never, { onError } as never);

        const wrappedOnError = getWrappedOnError();
        const result = wrappedOnError(new Error('original'), {});

        expect(result).toBe(replacement);
    });
});
