# v-confirm-button

Requires a second click to confirm an action. On first click, changes button text to "Confirm". Moving the mouse away resets it.

Listen for `@confirm` instead of `@click`.

## Usage

```vue
<!-- Basic usage -->
<button v-confirm-button @confirm="deleteItem">Delete</button>

<!-- Custom confirmation text and class -->
<button v-confirm-button="{ text: 'Really delete?', class: 'confirming' }" @confirm="deleteItem">
    Delete
</button>

<!-- No text change, just require double click -->
<button v-confirm-button="{ text: null }" @confirm="deleteItem">
    Delete
</button>
```

## Options

| Property | Type             | Default     | Description                                               |
| -------- | ---------------- | ----------- | --------------------------------------------------------- |
| `text`   | `string \| null` | `'Confirm'` | Text shown after first click. `null` keeps original text. |
| `class`  | `string`         | -           | CSS class added to the button in confirm state            |

## Demo

<DemoContainer>
  <DemoConfirmButton />
  <template #source>

<<< @/demos/directives/DemoConfirmButton.vue

  </template>
</DemoContainer>

<script setup>
import DemoConfirmButton from '../demos/directives/DemoConfirmButton.vue';
</script>
