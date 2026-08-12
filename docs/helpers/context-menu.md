# Context Menu

A vanilla JS context menu with separator, submenu, and confirmation support.

## Import

```typescript
import { showContextMenu } from '@zyno-io/vue-foundation';
```

## `showContextMenu(event, config)`

Displays a context menu at the mouse position. The menu opens toward whichever side of the cursor has room (right/below by preference), and a menu taller than the viewport pins to it and scrolls internally. Clicking outside the menu closes it.

```typescript
function handleRightClick(e: MouseEvent) {
    e.preventDefault();
    showContextMenu(e, {
        items: [
            { title: 'Edit', handler: () => editItem() },
            { title: 'Duplicate', handler: () => duplicateItem() },
            {
                title: 'Move to',
                items: [
                    { title: 'Inbox', handler: () => moveTo('inbox') },
                    { title: 'Archive', handler: () => moveTo('archive') }
                ]
            },
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

| Property        | Type                         | Description                                                |
| --------------- | ---------------------------- | ---------------------------------------------------------- |
| `title`         | `string`                     | Display text for the menu item                             |
| `handler`       | `() => void`                 | Callback executed when the item is clicked                 |
| `class`         | `string`                     | CSS class added to the item element                        |
| `shouldConfirm` | `boolean`                    | Requires a second click to confirm (see below)             |
| `items`         | `(ContextMenuItem \| '-')[]` | Child items — the item opens a submenu instead (see below) |

Use the string `'-'` in the `items` array to insert a visual separator between groups of items.

## Submenus

An item with `items` opens a flyout submenu on hover or click instead of running a handler (`handler` is ignored on such items). Submenus nest to any depth, position themselves beside their parent — flipping to the other side when out of room — and use the same viewport pinning/scrolling as the root menu. The parent item gets the `.has-submenu` class, a `.submenu-caret` element, and `.submenu-open` while its submenu is showing.

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
