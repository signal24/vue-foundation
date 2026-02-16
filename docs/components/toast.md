# Toast Notifications

Display toast notifications using the `showToast` helper function.

## Import

```typescript
import { showToast } from '@zyno-io/vue-foundation';
```

## `showToast(options)`

Displays a toast notification. Returns a dismiss function.

```typescript
const dismiss = showToast({
    message: 'Item saved successfully',
    position: 'bottom', // 'top' | 'bottom' (default: 'bottom')
    durationSecs: 5, // auto-dismiss seconds (default: 5, null to keep open)
    className: 'success', // CSS class on toast element
    disableClose: false, // hide close button
    onClick: () => {} // called on click before dismissal
});

// Dismiss programmatically
dismiss();
```

## Options

| Option         | Type                | Default    | Description                                   |
| -------------- | ------------------- | ---------- | --------------------------------------------- |
| `message`      | `string`            | --         | Toast message text                            |
| `position`     | `'top' \| 'bottom'` | `'bottom'` | Vertical position                             |
| `durationSecs` | `number \| null`    | `5`        | Auto-dismiss in seconds (`null` to keep open) |
| `className`    | `string`            | --         | CSS class on the toast element                |
| `disableClose` | `boolean`           | `false`    | Hide the close button                         |
| `onClick`      | `() => void`        | --         | Called on click before dismissal              |

## Notes

- Toasts include an animated progress bar that shows remaining time.
- Clicking the toast or the close button dismisses it.
- Style with the `.vf-toast` CSS class.

## Demo

<DemoContainer>
  <DemoToast />
  <template #source>

<<< @/demos/components/DemoToast.vue

  </template>
</DemoContainer>

<script setup>
import DemoToast from '../demos/components/DemoToast.vue';
</script>
