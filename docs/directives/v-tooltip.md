# v-tooltip

Displays a tooltip that follows the cursor on hover. The tooltip auto-positions to stay within the viewport.

## Usage

```vue
<!-- String binding -->
<button v-tooltip="'Click to save'">Save</button>

<!-- Using tip attribute -->
<span v-tooltip tip="Help text">?</span>

<!-- HTML content -->
<div v-tooltip="'<strong>Bold</strong> text'" html>Info</div>

<!-- Show alert on mobile tap -->
<span v-tooltip="'Details here'" alert-on-tap>?</span>

<!-- Disable tooltip conditionally -->
<span v-tooltip="isActive ? 'Active' : null">Status</span>
```

## Options

| Attribute      | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `tip`          | Tooltip text via HTML attribute (alternative to binding value) |
| `html`         | Render tooltip content as HTML                                 |
| `alert-on-tap` | Show an alert dialog on mobile tap instead of tooltip          |

Pass `null` as the binding value to conditionally disable the tooltip.

Style the tooltip with the `.vf-tooltip` CSS class.

## Demo

<DemoContainer>
  <DemoTooltip />
  <template #source>

<<< @/demos/directives/DemoTooltip.vue

  </template>
</DemoContainer>

<script setup>
import DemoTooltip from '../demos/directives/DemoTooltip.vue';
</script>
