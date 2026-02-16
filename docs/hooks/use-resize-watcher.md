# useResizeWatcher

Composition API hook that calls a function on every window resize event. Handles mount/unmount and `keep-alive` activate/deactivate lifecycles automatically.

## Import

```typescript
import { useResizeWatcher } from '@zyno-io/vue-foundation';
```

## Usage

```typescript
import { useResizeWatcher } from '@zyno-io/vue-foundation';

useResizeWatcher(() => {
    recalculateLayout();
});
```

Call `useResizeWatcher` inside a component's `setup` function. The callback is registered as a `resize` event listener on `window` when the component mounts, and removed when it unmounts.

## Lifecycle

| Lifecycle Hook    | Action                              |
| ----------------- | ----------------------------------- |
| `onMounted`       | Adds `resize` listener on `window`  |
| `onActivated`     | Re-adds listener (for `keep-alive`) |
| `onDeactivated`   | Removes listener (for `keep-alive`) |
| `onBeforeUnmount` | Removes listener                    |

## Example: Responsive Layout

```vue
<script setup>
import { ref } from 'vue';
import { useResizeWatcher } from '@zyno-io/vue-foundation';

const columns = ref(3);

function updateColumns() {
    if (window.innerWidth < 640) columns.value = 1;
    else if (window.innerWidth < 1024) columns.value = 2;
    else columns.value = 3;
}

useResizeWatcher(updateColumns);
</script>
```

## Demo

<DemoContainer>
  <DemoResizeWatcher />
  <template #source>

<<< @/demos/hooks/DemoResizeWatcher.vue

  </template>
</DemoContainer>

<script setup>
import DemoResizeWatcher from '../demos/hooks/DemoResizeWatcher.vue';
</script>
