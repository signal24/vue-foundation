# OpenAPI Client Configuration

Integrates `@signal24/openapi-client-codegen` with the vue-foundation error handling system.

## Import

```typescript
import { configureVfOpenApiClient } from '@signal24/vue-foundation';
```

## `configureVfOpenApiClient(client, options)`

Wraps `configureOpenApiClient` from `@signal24/openapi-client-codegen` with automatic error conversion. HTTP 422 responses that contain a JSON body with an `error` string property are automatically converted to `UserError` instances, so they flow through the standard error handling pipeline as user-facing messages.

```typescript
import { configureVfOpenApiClient } from '@signal24/vue-foundation';
import { apiClient } from './api-client';

configureVfOpenApiClient(apiClient, {
    onError(err, options) {
        console.error('API error:', err);
        return err;
    }
});
```

## How It Works

1. The function wraps the `onError` handler you provide.
2. When an `OpenApiError` is caught with HTTP status `422` and a body shaped as `{ error: string }`, it is replaced with a `UserError`.
3. Your `onError` handler is called after the conversion, receiving the (potentially converted) error.
4. If your handler returns `undefined`, the error is re-thrown. If it returns a value, that value is returned to the caller.

## Prerequisites

This helper requires the `@signal24/openapi-client-codegen` package:

```bash
yarn add @signal24/openapi-client-codegen
```

## Example: Full Setup

```typescript
import { configureVfOpenApiClient, handleErrorAndAlert } from '@signal24/vue-foundation';
import { apiClient } from './api-client';

configureVfOpenApiClient(apiClient, {
    onError(err, options) {
        // Log all API errors
        console.error('API error:', err);
        return err;
    }
});

// Later, in a component:
try {
    await apiClient.updateUser(userId, data);
} catch (err) {
    // If the server returned 422 { error: "Email already taken" },
    // err is now a UserError and the alert shows "Email already taken"
    // without the system error wrapper text.
    await handleErrorAndAlert(err);
}
```
