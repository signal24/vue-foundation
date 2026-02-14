# VfSmartSelect

Advanced searchable select component with filtering, keyboard navigation, grouping, and async data loading.

## Import

```typescript
import { VfSmartSelect } from '@signal24/vue-foundation';
```

## Basic Usage

```vue
<VfSmartSelect v-model="selectedUser" :options="users" :label-field="'name'" :value-field="'id'" placeholder="Select a user..." null-title="None" />
```

## Props

| Prop                      | Type                                       | Description                                          |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `modelValue`              | `V \| null`                                | Selected value (v-model)                             |
| `options`                 | `T[]`                                      | Static options array                                 |
| `loadOptions`             | `(search: string \| null) => Promise<T[]>` | Async option loader                                  |
| `preload`                 | `boolean`                                  | Load options immediately on mount                    |
| `remoteSearch`            | `boolean`                                  | Reload options on each search (debounced 250ms)      |
| `keyField`                | `keyof T`                                  | Field used as unique key                             |
| `keyExtractor`            | `(option: T) => string \| symbol`          | Custom key extraction                                |
| `valueField`              | `keyof T`                                  | Field used as the emitted value                      |
| `valueExtractor`          | `(option: T) => V`                         | Custom value extraction                              |
| `labelField`              | `keyof T`                                  | Field displayed as option text                       |
| `formatter`               | `(option: T) => string`                    | Custom display formatter                             |
| `selectionFormatter`      | `(option: T) => string`                    | Custom formatter for the selected value in the input |
| `subtitleFormatter`       | `(option: T) => string`                    | Format subtitle text below option                    |
| `classForOption`          | `(option: T) => string`                    | CSS class per option                                 |
| `groupField`              | `keyof T`                                  | Field to group options by                            |
| `groupFormatter`          | `(option: T) => string`                    | Custom group label formatter                         |
| `searchFields`            | `(keyof T)[]`                              | Fields to search (defaults to title + subtitle)      |
| `prependOptions`          | `T[]`                                      | Options prepended to the list                        |
| `appendOptions`           | `T[]`                                      | Options appended to the list                         |
| `onCreateItem`            | `(text: string) => void`                   | Enable "Create ..." option when no match             |
| `showCreateTextOnNewItem` | `boolean`                                  | Show "Create \<text\>..." label (default: `true`)    |
| `nullTitle`               | `string`                                   | Text for the null/deselect option                    |
| `noResultsText`           | `string`                                   | Text when search has no matches                      |
| `placeholder`             | `string`                                   | Input placeholder text                               |
| `loadingText`             | `string`                                   | Placeholder while loading                            |
| `disabled`                | `boolean`                                  | Disable the select                                   |
| `required`                | `boolean`                                  | HTML required attribute                              |
| `name`                    | `string`                                   | HTML name attribute                                  |
| `autoNext`                | `boolean`                                  | Focus next input after selection                     |
| `debug`                   | `boolean`                                  | Keep options open on blur (development aid)          |

## Events

| Event               | Description                                |
| ------------------- | ------------------------------------------ |
| `update:modelValue` | Emitted when the selected value changes    |
| `optionsLoaded`     | Emitted after async options finish loading |

## Slots

```vue
<VfSmartSelect v-model="value" :options="items">
    <!-- Custom option rendering -->
    <template #option="{ option }">
        <div class="custom-option">
            <img :src="option.ref.avatar" />
            <span>{{ option.title }}</span>
        </div>
    </template>

    <!-- Custom group header -->
    <template #group="{ group }">
        <strong>{{ group }}</strong>
    </template>

    <!-- Custom no-results message -->
    <template #no-results>
        No matches. Try a different search.
    </template>
</VfSmartSelect>
```

## Exposed Methods

```typescript
const selectRef = ref();
selectRef.value.addRemoteOption(newOption); // Add option to remote options list
```

## Features

- Search text highlighting via mark.js
- Keyboard navigation (Arrow keys, Page Up/Down, Home/End, Enter, Escape)
- Option list teleported to body for proper z-index stacking
- Automatic scroll management for highlighted options

## Demo

<DemoContainer>
  <DemoVfSmartSelect />
  <template #source>

<<< @/demos/components/DemoVfSmartSelect.vue

  </template>
</DemoContainer>

<script setup>
import DemoVfSmartSelect from '../demos/components/DemoVfSmartSelect.vue';
</script>
