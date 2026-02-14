# v-autofocus

Auto-focuses the element on mount. Works with `<input>`, `<button>`, `<textarea>`, and `<select>`. For other elements, focuses the first `<input>` child.

## Usage

```vue
<input v-autofocus />
```

## Demo

<DemoContainer>
  <DemoAutofocus />
  <template #source>

<<< @/demos/directives/DemoAutofocus.vue

  </template>
</DemoContainer>

<script setup>
import DemoAutofocus from '../demos/directives/DemoAutofocus.vue';
</script>
