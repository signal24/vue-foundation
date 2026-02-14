# v-sticky-min-width

Prevents a sticky element from shrinking below its current width. Uses `ResizeObserver` to track width changes and updates `min-width` accordingly.

Can be globally disabled via `configureVf({ disableStickyMinWidthDirective: true })`.

## Usage

```vue
<th v-sticky-min-width style="position: sticky; top: 0;">Column Header</th>

<!-- Conditionally disable -->
<th v-sticky-min-width="shouldStick">Header</th>
```

## Demo

<DemoContainer>
  <DemoStickyMinWidth />
  <template #source>

<<< @/demos/directives/DemoStickyMinWidth.vue

  </template>
</DemoContainer>

<script setup>
import DemoStickyMinWidth from '../demos/directives/DemoStickyMinWidth.vue';
</script>
