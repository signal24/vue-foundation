# Error Handling

Utilities for classifying, formatting, and handling errors. The convention is that `UserError` represents a user-facing message (shown directly), while all other errors are treated as system errors and wrapped with support text.

## Import

```typescript
import { UserError, formatError, toError, isError, handleErrorAndAlert, handleError } from '@signal24/vue-foundation';
```

## `UserError`

An `Error` subclass for user-facing messages. When formatted or shown in an alert, these messages are displayed verbatim without additional wrapper text.

```typescript
throw new UserError('Please enter a valid email address');
```

## `formatError(err)`

Formats any error value for display. `UserError` messages are returned as-is. All other errors are wrapped with a standard preamble and the support text configured via `configureVf()`.

```typescript
formatError(new UserError('Invalid email'));
// "Invalid email"

formatError(new Error('ECONNREFUSED'));
// "An application error has occurred:\n\nECONNREFUSED\n\nPlease refresh the page
//  and try again. If this error persists, please contact support."
```

## `handleErrorAndAlert(err, options?)`

Dispatches the error to the global `errorHandler` (for non-UserError instances), then shows an alert dialog with the formatted message.

```typescript
try {
    await riskyOperation();
} catch (err) {
    await handleErrorAndAlert(err, {
        title: 'Save Failed',
        cause: originalError,
        classes: ['error-alert']
    });
}
```

**Options:**

| Option    | Type       | Description                                   |
| --------- | ---------- | --------------------------------------------- |
| `title`   | `string`   | Alert dialog title                            |
| `cause`   | `any`      | Original cause error (attached via `toError`) |
| `classes` | `string[]` | CSS classes applied to the alert modal        |

## `handleError(err, cause?)`

Calls the global error handler without showing any UI. Useful for background or non-blocking errors.

```typescript
try {
    await backgroundTask();
} catch (err) {
    handleError(err);
}
```

## `toError(err, cause?)`

Coerces any value into a proper `Error` instance. If the value is already an `Error`, it is returned directly. Otherwise, a new `Error` is created with `String(err)` as the message. An optional `cause` is attached to the resulting error.

```typescript
const error = toError('string error'); // Error('string error')
const error = toError(err, originalCause); // sets error.cause
```

## `isError(err)`

Type guard that checks whether a value is an `Error` instance (or at least has `message` and `name` properties).

```typescript
if (isError(value)) {
    console.log(value.message); // TypeScript knows value is Error
}
```

## Demo

<DemoContainer>
  <DemoErrorHandling />
  <template #source>

<<< @/demos/helpers/DemoErrorHandling.vue

  </template>
</DemoContainer>

<script setup>
import DemoErrorHandling from '../demos/helpers/DemoErrorHandling.vue';
</script>
