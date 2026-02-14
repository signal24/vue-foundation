# useInfiniteScroll

Composition API hook for detecting when a scrollable element has been scrolled to the bottom. Supports three detection levels: the component's own element, a scrollable ancestor, and the window.

## Import

```typescript
import { useInfiniteScroll } from '@signal24/vue-foundation';
```

## Usage

```typescript
import { useInfiniteScroll } from '@signal24/vue-foundation';

useInfiniteScroll({
    elScrolledToBottom: () => loadMore(),
    ancestorScrolledToBottom: () => loadMore(),
    windowScrolledToBottom: () => loadMore()
});
```

Call `useInfiniteScroll` inside a component's `setup` function. It automatically installs scroll listeners on mount, removes them on unmount, and handles `keep-alive` activate/deactivate lifecycles.

## Options

| Option                     | Type         | Description                                                       |
| -------------------------- | ------------ | ----------------------------------------------------------------- |
| `elScrolledToBottom`       | `() => void` | Called when the component's root element is scrolled to bottom    |
| `ancestorScrolledToBottom` | `() => void` | Called when the nearest scrollable ancestor is scrolled to bottom |
| `windowScrolledToBottom`   | `() => void` | Called when the window is scrolled to bottom                      |

All options are optional. Provide only the ones you need.

## Behavior

- The callback fires once when the scroll position reaches the bottom (within a 5px threshold).
- After firing, the handler is "tripped" and will not fire again until the user scrolls away from the bottom.
- Scrolling away from the bottom resets the trip, allowing it to fire again on the next scroll-to-bottom.
- For `ancestorScrolledToBottom`, the hook walks up the DOM tree to find the nearest ancestor with `overflow: auto` or `overflow: scroll`.

## Example: Paginated List

```vue
<template>
    <div style="overflow: auto; height: 400px">
        <div v-for="item in items" :key="item.id">{{ item.name }}</div>
        <div v-if="loading">Loading more...</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useInfiniteScroll } from '@signal24/vue-foundation';

const items = ref([]);
const loading = ref(false);
let page = 1;

async function loadMore() {
    if (loading.value) return;
    loading.value = true;
    const newItems = await fetchItems(page++);
    items.value.push(...newItems);
    loading.value = false;
}

useInfiniteScroll({
    elScrolledToBottom: loadMore
});

loadMore(); // initial load
</script>
```

## Demo

<DemoContainer>
  <DemoInfiniteScroll />
  <template #source>

<<< @/demos/hooks/DemoInfiniteScroll.vue

  </template>
</DemoContainer>

<script setup>
import DemoInfiniteScroll from '../demos/hooks/DemoInfiniteScroll.vue';
</script>
