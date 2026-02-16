# Overlay API

Low-level overlay management functions for creating, updating, and removing overlays programmatically.

## Import

```typescript
import {
    presentOverlay,
    createOverlayInjection,
    removeOverlayInjection,
    updateOverlayProps,
    dismissOverlayInjectionById,
    dismissOverlayInjectionByInstance
} from '@zyno-io/vue-foundation';
```

## `presentOverlay(component, props, options?)`

Shows a component as an overlay and returns a Promise that resolves when the overlay is dismissed.

```typescript
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

See the [Overlay System guide](/guide/overlay-system) for full details on anchored overlays.

## `createOverlayInjection(component, props)`

Low-level function to create an overlay without Promise wrapping.

```typescript
const injection = createOverlayInjection(MyComponent, props);
```

## `updateOverlayProps(injection, props)`

Update props on an existing overlay injection.

```typescript
updateOverlayProps(injection, { message: 'Updated!' });
```

## `removeOverlayInjection(injection)`

Remove an overlay injection from the overlay container.

```typescript
removeOverlayInjection(injection);
```

## `dismissOverlayInjectionById(overlayId)`

Dismiss an overlay by its ID.

```typescript
dismissOverlayInjectionById(overlayId);
```

## `dismissOverlayInjectionByInstance(instance)`

Dismiss an overlay by its component instance.

```typescript
dismissOverlayInjectionByInstance(componentInstance);
```

## Demo

<DemoContainer>
  <DemoOverlay />
  <template #source>

<<< @/demos/components/DemoOverlay.vue

  </template>
</DemoContainer>

<script setup>
import DemoOverlay from '../demos/components/DemoOverlay.vue';
</script>
