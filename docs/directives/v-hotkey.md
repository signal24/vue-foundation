# v-hotkey

Binds a keyboard shortcut to programmatically click the element.

## Usage

```vue
<button v-hotkey="'s'" @click="save">Save</button>
<button v-hotkey="'Enter'" @click="submit">Submit</button>
<button v-hotkey="'Escape'" @click="cancel">Cancel</button>
```

Values match `KeyboardEvent.key`. When multiple elements share a hotkey, the last-mounted element takes precedence. The default browser behavior for the key is prevented.

## Demo

<DemoContainer>
  <DemoHotkey />
  <template #source>

<<< @/demos/directives/DemoHotkey.vue

  </template>
</DemoContainer>

<script setup>
import DemoHotkey from '../demos/directives/DemoHotkey.vue';
</script>
