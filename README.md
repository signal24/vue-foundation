# @signal24/vue-foundation

A Vue 3 component library providing common components, directives, helpers, and hooks for building applications. Distributed as an ES module with full TypeScript type definitions.

## Documentation

Full documentation and live interactive demos: **[signal24.github.io/vue-foundation](https://signal24.github.io/vue-foundation/)**

## Quick Start

```bash
yarn add @signal24/vue-foundation
# Peer dependencies
yarn add vue date-fns lodash
```

```typescript
import { createApp } from 'vue';
import { installVf, configureVf, OverlayContainer } from '@signal24/vue-foundation';
import '@signal24/vue-foundation/dist/vue-foundation.css';

import App from './App.vue';

const app = createApp(App);
installVf(app);
configureVf({});
app.mount('#app');
```

See the [Getting Started guide](https://signal24.github.io/vue-foundation/guide/getting-started) for full setup instructions.

## What's Included

- **Components** — Modal system, searchable selects, toast notifications, overlay management
- **Directives** — v-tooltip, v-hotkey, v-datetime, v-confirm-button, v-infinite-scroll, and more
- **Helpers** — Error handling, form masking, context menus, string/number/object utilities
- **Hooks** — useInfiniteScroll, useResizeWatcher
- **Filters** — Display formatting via createFilters()
- **Types** — Branded types, PickRequired, PickOptional, and more

## License

MIT
