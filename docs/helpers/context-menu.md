# Context Menu

A vanilla JS context menu with separator and confirmation support.

## Import

```typescript
import { showContextMenu } from '@zyno-io/vue-foundation';
```

## `showContextMenu(event, config)`

Displays a context menu at the mouse position. The menu auto-positions to stay within the viewport. Clicking outside the menu closes it.

```typescript
function handleRightClick(e: MouseEvent) {
    e.preventDefault();
    showContextMenu(e, {
        items: [
            { title: 'Edit', handler: () => editItem() },
            { title: 'Duplicate', handler: () => duplicateItem() },
            '-', // separator
            {
                title: 'Delete',
                handler: () => deleteItem(),
                class: 'danger',
                shouldConfirm: true
            }
        ],
        class: 'my-menu',
        targetClass: 'menu-open'
    });
}
```

## Config

| Property      | Type                         | Description                                              |
| ------------- | ---------------------------- | -------------------------------------------------------- |
| `items`       | `(ContextMenuItem \| '-')[]` | Menu items and separators                                |
| `class`       | `string`                     | CSS class added to the `.vf-context-menu` element        |
| `targetClass` | `string`                     | CSS class added to the target element while menu is open |

## Menu Item

| Property        | Type         | Description                                    |
| --------------- | ------------ | ---------------------------------------------- |
| `title`         | `string`     | Display text for the menu item                 |
| `handler`       | `() => void` | Callback executed when the item is clicked     |
| `class`         | `string`     | CSS class added to the item element            |
| `shouldConfirm` | `boolean`    | Requires a second click to confirm (see below) |

Use the string `'-'` in the `items` array to insert a visual separator between groups of items.

## Confirmation

When `shouldConfirm` is `true`, the first click changes the item text to "Confirm". Moving the mouse away from the item resets it to its original text. The handler is only executed on the second click.

## Styling

Style the menu using the `.vf-context-menu` CSS class. Items use `.item`, separators use `.separator`, and items awaiting confirmation have the `.pending-confirm` class.

## Demo

<DemoContainer>
  <DemoContextMenu />
  <template #source>

<<< @/demos/components/DemoContextMenu.vue

  </template>
</DemoContainer>

<script setup>
import DemoContextMenu from '../demos/components/DemoContextMenu.vue';
</script>
