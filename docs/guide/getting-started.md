# Getting Started

## Installation

```bash
yarn add @zyno-io/vue-foundation
```

### Peer Dependencies

```bash
yarn add vue date-fns lodash
# Optional, for OpenAPI integration:
yarn add @zyno-io/openapi-client-codegen
```

## Setup

Register directives and import styles in your app entry:

```typescript
import { createApp } from 'vue';
import { installVf, configureVf, OverlayContainer } from '@zyno-io/vue-foundation';
import '@zyno-io/vue-foundation/dist/vue-foundation.css';

import App from './App.vue';

const app = createApp(App);

// Register all directives
installVf(app);

// Configure global options
configureVf({
    errorHandler: err => console.error(err),
    unhandledErrorSupportText: 'please contact support@example.com',
    defaultDateFormat: 'M/d/yyyy',
    defaultTimeFormat: 'HH:mm',
    defaultCurrencyDivisor: 1
});

app.mount('#app');
```

Add the `OverlayContainer` component to your root `App.vue` to enable modals, toasts, and alerts:

```vue
<template>
    <router-view />
    <OverlayContainer />
</template>

<script setup>
import { OverlayContainer } from '@zyno-io/vue-foundation';
</script>
```

## Configuration Options

| Option                           | Type                      | Default                    | Description                                |
| -------------------------------- | ------------------------- | -------------------------- | ------------------------------------------ |
| `errorHandler`                   | `(err: Error) => void`    | `console.error`            | Global handler for non-user errors         |
| `unhandledErrorSupportText`      | `string`                  | `'please contact support'` | Text appended to system error messages     |
| `defaultDateFormat`              | `string`                  | `'M/d/yy'`                 | Default date format (date-fns syntax)      |
| `defaultTimeFormat`              | `string`                  | `'H:mm'`                   | Default time format (date-fns syntax)      |
| `defaultCurrencyDivisor`         | `number`                  | `1`                        | Default divisor for `formatUSCurrency()`   |
| `onOverlaysChanged`              | `(count: number) => void` | —                          | Callback when active overlay count changes |
| `disableStickyMinWidthDirective` | `boolean`                 | —                          | Globally disable `v-sticky-min-width`      |
