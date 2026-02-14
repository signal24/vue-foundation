# Overlay System

The library uses a global overlay system for modals, toasts, and anchored overlays. Components are rendered via Vue Teleport into a `#vf-overlay-target` element that the library manages automatically.

The core function is `presentOverlay()`, which shows a component as an overlay and returns a Promise that resolves when the overlay is dismissed.

## `presentOverlay(component, props, options?)`

```typescript
import { presentOverlay } from '@signal24/vue-foundation';

const result = await presentOverlay(MyModal, {
    title: 'Edit User',
    user: currentUser
});
```

Overlay components must have a `callback` prop. When the component calls `props.callback(result)`, the overlay is dismissed and the promise resolves with `result`. You don't pass `callback` yourself -- `presentOverlay` injects it automatically.

### Options

```typescript
interface OverlayOptions {
    anchor?: OverlayAnchorOptions; // Position relative to an element
    onCallback?: (result) => void | Promise<boolean>; // Return false to prevent dismissal
}
```

### Creating an Overlay Component

```vue
<template>
    <VfModal close-on-mask-click>
        <template #header>{{ title }}</template>
        <p>{{ message }}</p>
        <template #footer>
            <button @click="callback('yes')">Yes</button>
            <button @click="callback('no')">No</button>
        </template>
    </VfModal>
</template>

<script setup>
import { VfModal } from '@signal24/vue-foundation';

defineProps<{
    title: string;
    message: string;
    callback: (result: 'yes' | 'no') => void;
}>();
</script>
```

### Validating Before Dismissal

```typescript
const result = await presentOverlay(
    MyFormModal,
    { data },
    {
        onCallback: async formData => {
            const isValid = await validate(formData);
            if (!isValid) return false; // keeps the modal open
        }
    }
);
```

## Anchored Overlays

Position overlays relative to a DOM element:

```typescript
presentOverlay(
    DropdownMenu,
    { items },
    {
        anchor: {
            el: buttonElement,
            y: 'below', // 'auto' | 'above' | 'center' | 'below'
            x: 'left', // 'auto' | 'left' | 'center' | 'right'
            matchWidth: true, // match anchor element width
            matchHeight: false,
            class: 'my-dropdown'
        }
    }
);
```

With `'auto'` positioning (the default), the overlay flips to stay within the viewport.

## Other Overlay Functions

```typescript
import {
    createOverlayInjection,
    removeOverlayInjection,
    updateOverlayProps,
    dismissOverlayInjectionById,
    dismissOverlayInjectionByInstance
} from '@signal24/vue-foundation';

// Low-level: create without Promise wrapping
const injection = createOverlayInjection(MyComponent, props);

// Update props on an existing overlay
updateOverlayProps(injection, { message: 'Updated!' });

// Remove overlay
removeOverlayInjection(injection);

// Dismiss by overlay ID
dismissOverlayInjectionById(overlayId);
```
