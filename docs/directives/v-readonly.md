# v-readonly

Dynamically sets the `readonly` attribute. When used on a `<label>`, targets its child `<input>`.

## Usage

```vue
<input v-readonly="!isEditing" />
```

## Demo

<DemoContainer>
  <DemoReadonly />
  <template #source>

<<< @/demos/directives/DemoReadonly.vue

  </template>
</DemoContainer>

<script setup>
import DemoReadonly from '../demos/directives/DemoReadonly.vue';
</script>
