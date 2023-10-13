import { installOpenApiClientInterceptors, isOpenApiError } from '@signal24/openapi-client-codegen/helpers';

import { UserError } from '.';

export function installApiClientInterceptors(clientOptions: Parameters<typeof installOpenApiClientInterceptors>[0]) {
    installOpenApiClientInterceptors({
        ...clientOptions,
        onError(err, options) {
            if (isOpenApiError(err) && err.status === 422 && typeof err.body === 'object' && 'error' in err.body) {
                err = new UserError(err.body.error);
            }

            clientOptions.onError?.(err, options);
        }
    });
}
