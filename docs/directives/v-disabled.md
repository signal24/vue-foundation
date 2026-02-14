# v-disabled

Dynamically sets the `disabled` attribute. When used on a `<label>`, also targets its child `<input>` and toggles a `.disabled` class on the label.

## Usage

```vue
<input v-disabled="isLoading" />

<label v-disabled="!canEdit">
    <input type="checkbox" /> Enable feature
</label>
```

## Demo

<DemoContainer>
  <DemoDisabled />
  <template #source>

<<< @/demos/directives/DemoDisabled.vue

  </template>
</DemoContainer>

<script setup>
import DemoDisabled from '../demos/directives/DemoDisabled.vue';
</script>
