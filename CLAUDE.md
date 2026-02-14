# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

`@signal24/vue-foundation` is a Vue 3 component library (components, directives, helpers, hooks) distributed as an ES module with TypeScript types. See `README.md` for full API documentation.

## Commands

```bash
yarn build          # Clean dist, Vite build, generate types
yarn build:watch    # Rebuild on file changes
yarn demo           # Run demo app for testing components
yarn dev            # Vite dev server
yarn test:unit      # Run unit tests (Vitest)
yarn test:types     # Type checking (vue-tsc)
yarn lint           # ESLint with auto-fix
yarn format         # Prettier
```

## Architecture

```
src/
  index.ts              # Main entry, exports everything, installVf()
  config.ts             # Global options (configureVf)
  types.ts              # Utility types (Branded, PickRequired, etc.)
  components/           # Vue components + overlay system
    overlay-container.ts  # Core overlay management (presentOverlay, etc.)
    overlay-anchor.vue    # Positioned overlays
    overlay-types.ts      # Anchor option types
    vf-modal.vue          # Base modal shell
    vf-alert-modal.vue    # Alert/confirm dialog
    alert-helpers.ts      # showAlert, showConfirm, showWait, etc.
    modal-helpers.ts      # vfModalRef()
    vf-toast.vue          # Toast notification
    toast-helpers.ts      # showToast()
    vf-smart-select.vue   # Searchable select with generics
    vf-ez-smart-select.vue # Simplified smart select
    vf-ajax-select.vue    # Async-loading select
  directives/           # v-autofocus, v-tooltip, v-hotkey, v-datetime, etc.
    index.ts              # registerDirectives() + type augmentation
  helpers/              # Pure utility functions
  hooks/                # Composition API hooks (infinite-scroll, resize-watcher)
  filters/              # Display formatting (createFilters)
  vite-plugins/         # OpenAPI client generator Vite plugin
```

## Key Patterns

- **Overlay system**: Components with a `callback` prop are shown via `presentOverlay()`, which wraps them in a Promise. The callback prop is injected automatically.
- **Error convention**: `UserError` = user-facing (shown directly), other errors = system errors (wrapped with support text). `handleErrorAndAlert()` dispatches to the global error handler and shows an alert.
- **Masking**: `maskForm()` / `maskComponent()` disable UI during async ops and return an unmask function.
- **Directives**: All registered in `registerDirectives()`. State is stored on elements via Symbols.
- **Generics**: `VfSmartSelect` and `VfAjaxSelect` use Vue 3.3+ `defineProps` with generics.

## Build Details

- Vite library mode, ES format only
- External deps: `vue`, `@vue/shared`, `date-fns`, `lodash`, `@signal24/openapi-client-codegen`
- SCSS with `api: 'modern-compiler'`
- Vite-plugins have separate tsconfig (`tsconfig.vite-plugins.json`)
- Main branch is `develop`
