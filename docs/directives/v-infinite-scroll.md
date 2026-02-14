# v-infinite-scroll

Triggers a callback when the element is scrolled to the bottom. Fires once when reaching the bottom, then resets when scrolled away so it can fire again.

## Usage

```vue
<div v-infinite-scroll="loadMore" style="overflow: auto; height: 400px;">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>
```

## Demo

<DemoContainer>
  <DemoInfiniteScroll />
  <template #source>

<<< @/demos/directives/DemoInfiniteScroll.vue

  </template>
</DemoContainer>

<script setup>
import DemoInfiniteScroll from '../demos/directives/DemoInfiniteScroll.vue';
</script>
