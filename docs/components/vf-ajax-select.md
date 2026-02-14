# VfAjaxSelect

Simple select component that loads options from an async function.

## Import

```typescript
import { VfAjaxSelect } from '@signal24/vue-foundation';
```

## Basic Usage

```vue
<VfAjaxSelect
    v-model="selectedItem"
    :load-fn="() => api.getItems()"
    display-key="name"
    null-text="Select an item..."
    loading-text="Loading items..."
/>
```

## Props

| Prop          | Type                    | Description                                        |
| ------------- | ----------------------- | -------------------------------------------------- |
| `modelValue`  | `T`                     | Selected value (v-model)                           |
| `loadFn`      | `() => Promise<T[]>`    | Async function returning options                   |
| `displayKey`  | `keyof T`               | Property to display for each option                |
| `preprocesor` | `(option: T) => string` | Custom display formatter                           |
| `nullText`    | `string`                | Placeholder option text                            |
| `loadingText` | `string`                | Text shown while loading (default: `'Loading...'`) |

## Demo

<DemoContainer>
  <DemoVfAjaxSelect />
  <template #source>

<<< @/demos/components/DemoVfAjaxSelect.vue

  </template>
</DemoContainer>

<script setup>
import DemoVfAjaxSelect from '../demos/components/DemoVfAjaxSelect.vue';
</script>
