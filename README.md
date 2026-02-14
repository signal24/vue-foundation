# @signal24/vue-foundation

A Vue 3 component library providing common components, directives, and helpers for building applications. Distributed as an ES module with full TypeScript type definitions.

## Installation

```bash
npm install @signal24/vue-foundation
# or
yarn add @signal24/vue-foundation
```

### Peer Dependencies

```bash
npm install vue date-fns lodash
# Optional, for OpenAPI integration:
npm install @signal24/openapi-client-codegen
```

## Setup

Register directives and import styles in your app entry:

```typescript
import { createApp } from 'vue';
import { installVf, configureVf, OverlayContainer } from '@signal24/vue-foundation';
import '@signal24/vue-foundation/dist/vue-foundation.css';

import App from './App.vue';

const app = createApp(App);

// Register all directives
app.use(installVf);

// Configure global options
configureVf({
    errorHandler: err => console.error(err),
    unhandledErrorSupportText: 'please contact support@example.com',
    defaultDateFormat: 'M/d/yyyy',
    defaultTimeFormat: 'HH:mm',
    defaultCurrencyDivisor: 1
});

app.mount('#app');
```

Add the `OverlayContainer` component to your root `App.vue` to enable modals, toasts, and alerts:

```vue
<template>
    <router-view />
    <OverlayContainer />
</template>

<script setup>
import { OverlayContainer } from '@signal24/vue-foundation';
</script>
```

### Configuration Options

| Option                           | Type                      | Default                    | Description                                |
| -------------------------------- | ------------------------- | -------------------------- | ------------------------------------------ |
| `errorHandler`                   | `(err: Error) => void`    | `console.error`            | Global handler for non-user errors         |
| `unhandledErrorSupportText`      | `string`                  | `'please contact support'` | Text appended to system error messages     |
| `defaultDateFormat`              | `string`                  | `'M/d/yy'`                 | Default date format (date-fns syntax)      |
| `defaultTimeFormat`              | `string`                  | `'H:mm'`                   | Default time format (date-fns syntax)      |
| `defaultCurrencyDivisor`         | `number`                  | `1`                        | Default divisor for `formatUSCurrency()`   |
| `onOverlaysChanged`              | `(count: number) => void` | —                          | Callback when active overlay count changes |
| `disableStickyMinWidthDirective` | `boolean`                 | —                          | Globally disable `v-sticky-min-width`      |

---

## Components

### Overlay System

The library uses a global overlay system for modals, toasts, and anchored overlays. Components are rendered via Vue Teleport into a `#vf-overlay-target` element that the library manages automatically.

The core function is `presentOverlay()`, which shows a component as an overlay and returns a Promise that resolves when the overlay is dismissed.

#### `presentOverlay(component, props, options?)`

```typescript
import { presentOverlay } from '@signal24/vue-foundation';

const result = await presentOverlay(MyModal, {
    title: 'Edit User',
    user: currentUser
});
```

Overlay components must have a `callback` prop. When the component calls `props.callback(result)`, the overlay is dismissed and the promise resolves with `result`. You don't pass `callback` yourself — `presentOverlay` injects it automatically.

**Options:**

```typescript
interface OverlayOptions {
    anchor?: OverlayAnchorOptions; // Position relative to an element
    onCallback?: (result) => void | Promise<boolean>; // Return false to prevent dismissal
}
```

**Creating an overlay component:**

```vue
<template>
    <VfModal close-on-mask-click>
        <template #header>{{ title }}</template>
        <p>{{ message }}</p>
        <template #footer>
            <button @click="callback('yes')">Yes</button>
            <button @click="callback('no')">No</button>
        </template>
    </VfModal>
</template>

<script setup>
import { VfModal } from '@signal24/vue-foundation';

defineProps<{
    title: string;
    message: string;
    callback: (result: 'yes' | 'no') => void;
}>();
</script>
```

**Validating before dismissal:**

```typescript
const result = await presentOverlay(
    MyFormModal,
    { data },
    {
        onCallback: async formData => {
            const isValid = await validate(formData);
            if (!isValid) return false; // keeps the modal open
        }
    }
);
```

#### Anchored Overlays

Position overlays relative to a DOM element:

```typescript
presentOverlay(
    DropdownMenu,
    { items },
    {
        anchor: {
            el: buttonElement,
            y: 'below', // 'auto' | 'above' | 'center' | 'below'
            x: 'left', // 'auto' | 'left' | 'center' | 'right'
            matchWidth: true, // match anchor element width
            matchHeight: false,
            class: 'my-dropdown'
        }
    }
);
```

With `'auto'` positioning (the default), the overlay flips to stay within the viewport.

#### Other Overlay Functions

```typescript
import {
    createOverlayInjection,
    removeOverlayInjection,
    updateOverlayProps,
    dismissOverlayInjectionById,
    dismissOverlayInjectionByInstance
} from '@signal24/vue-foundation';

// Low-level: create without Promise wrapping
const injection = createOverlayInjection(MyComponent, props);

// Update props on an existing overlay
updateOverlayProps(injection, { message: 'Updated!' });

// Remove overlay
removeOverlayInjection(injection);

// Dismiss by overlay ID
dismissOverlayInjectionById(overlayId);
```

---

### VfModal

Base modal shell providing backdrop, layout, and slot structure.

```vue
<VfModal id="my-modal" close-on-mask-click scrolls close-x :class="['wide']">
    <template #header>Modal Title</template>

    <p>Modal content goes here.</p>

    <template #footer>
        <button @click="save">Save</button>
    </template>
</VfModal>
```

**Props:**

| Prop               | Type                 | Default | Description                                            |
| ------------------ | -------------------- | ------- | ------------------------------------------------------ |
| `id`               | `string`             | —       | HTML id attribute                                      |
| `closeOnMaskClick` | `boolean`            | `false` | Close when clicking backdrop (also enables Escape key) |
| `scrolls`          | `boolean`            | `false` | Enable scrolling in content area                       |
| `closeX`           | `boolean`            | `false` | Show close icon in header                              |
| `class`            | `string \| string[]` | —       | CSS classes on the overlay wrapper                     |
| `onClose`          | `() => void`         | —       | Custom close handler (overrides default dismiss)       |

**Slots:** `header`, `default` (content), `footer`

**Emits:** `formSubmit` — the modal wraps content in a `<form>`, so submit events bubble up.

**Exposed Methods:**

```typescript
const modalRef = vfModalRef();

// Mask the modal form (disable inputs, show "Please wait...")
const unmask = modalRef.value.mask();
unmask(); // restore

// Hide/show the modal without destroying it
const unhide = modalRef.value.hide();
unhide();
```

Use the `vfModalRef()` helper to create a properly typed ref:

```typescript
import { vfModalRef } from '@signal24/vue-foundation';

const modal = vfModalRef();
// <VfModal ref="modal" ...>
```

---

### Alert Helpers

Pre-built alert and confirm dialogs.

#### `showAlert(message)` / `showAlert(title, message)` / `showAlert(options)`

Shows an alert dialog with an OK button. Returns a Promise that resolves when dismissed.

```typescript
import { showAlert } from '@signal24/vue-foundation';

await showAlert('Something happened');
await showAlert('Warning', 'Something happened');
await showAlert({
    title: 'Error',
    message: new Error('Connection failed'), // Error objects are auto-formatted
    classes: ['error-alert'],
    iconClass: 'icon-warning',
    isHtml: false
});
```

#### `showConfirm(message)` / `showConfirm(title, message)` / `showConfirm(options)`

Shows a confirm dialog with Confirm/Cancel buttons. Returns `true` or `false`.

```typescript
import { showConfirm } from '@signal24/vue-foundation';

const ok = await showConfirm('Are you sure?');
const ok = await showConfirm('Delete Item', 'This cannot be undone.');
```

#### `showConfirmDestroy(message)` / `showConfirmDestroy(title, message)` / `showConfirmDestroy(options)`

Same as `showConfirm` but with destructive styling (red Confirm button).

```typescript
const ok = await showConfirmDestroy('Delete this record permanently?');
```

#### `showWait(message)` / `showWait(title, message)` / `showWait(options)`

Shows a non-dismissible wait overlay. Returns a dismiss function.

```typescript
import { showWait } from '@signal24/vue-foundation';

const dismiss = showWait('Processing...');
await longOperation();
dismiss();
```

#### `showMutableWait(message)` / `showMutableWait(title, message)` / `showMutableWait(options)`

Shows a wait overlay whose message can be updated. Returns `{ update, dismiss }`.

```typescript
import { showMutableWait } from '@signal24/vue-foundation';

const wait = showMutableWait('Starting...');
wait.update('Step 1 of 3...');
wait.update('Step 2 of 3...');
wait.update('Finishing...');
wait.dismiss();
```

---

### Toast Notifications

#### `showToast(options)`

Displays a toast notification. Returns a dismiss function.

```typescript
import { showToast } from '@signal24/vue-foundation';

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

Toasts include an animated progress bar that shows remaining time. Clicking the toast or the close button dismisses it.

---

### VfSmartSelect

Advanced searchable select component with filtering, keyboard navigation, grouping, and async data loading.

```vue
<VfSmartSelect v-model="selectedUser" :options="users" :label-field="'name'" :value-field="'id'" placeholder="Select a user..." null-title="None" />
```

**Props:**

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
| `showCreateTextOnNewItem` | `boolean`                                  | Show "Create <text>..." label (default: `true`)      |
| `nullTitle`               | `string`                                   | Text for the null/deselect option                    |
| `noResultsText`           | `string`                                   | Text when search has no matches                      |
| `placeholder`             | `string`                                   | Input placeholder text                               |
| `loadingText`             | `string`                                   | Placeholder while loading                            |
| `disabled`                | `boolean`                                  | Disable the select                                   |
| `required`                | `boolean`                                  | HTML required attribute                              |
| `name`                    | `string`                                   | HTML name attribute                                  |
| `autoNext`                | `boolean`                                  | Focus next input after selection                     |
| `debug`                   | `boolean`                                  | Keep options open on blur (development aid)          |

**Emits:** `update:modelValue`, `optionsLoaded`

**Slots:**

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

**Exposed Methods:**

```typescript
const selectRef = ref();
selectRef.value.addRemoteOption(newOption); // Add option to remote options list
```

**Features:**

- Search text highlighting via mark.js
- Keyboard navigation (Arrow keys, Page Up/Down, Home/End, Enter, Escape)
- Option list teleported to body for proper z-index stacking
- Automatic scroll management for highlighted options

---

### VfEzSmartSelect

Simplified wrapper around VfSmartSelect for string enum or key-value options.

```vue
<!-- Array of strings -->
<VfEzSmartSelect v-model="status" :options="['active', 'inactive', 'pending']" null-title="All statuses" />

<!-- Key-value object -->
<VfEzSmartSelect v-model="role" :options="{ admin: 'Administrator', user: 'Regular User', guest: 'Guest' }" placeholder="Select role..." />
```

**Props:**

| Prop          | Type                                | Description                           |
| ------------- | ----------------------------------- | ------------------------------------- |
| `modelValue`  | `T \| null`                         | Selected value (v-model)              |
| `options`     | `{ [key in T]: string } \| T[]`     | Options as object map or string array |
| `nullTitle`   | `string`                            | Text for deselect option              |
| `placeholder` | `string`                            | Input placeholder                     |
| `formatter`   | `(label: string, key: T) => string` | Custom label formatter                |
| `name`        | `string`                            | HTML name attribute                   |

---

### VfAjaxSelect

Simple select component that loads options from an async function.

```vue
<VfAjaxSelect
    v-model="selectedItem"
    :load-fn="() => api.getItems()"
    display-key="name"
    null-text="Select an item..."
    loading-text="Loading items..."
/>
```

**Props:**

| Prop          | Type                    | Description                                        |
| ------------- | ----------------------- | -------------------------------------------------- |
| `modelValue`  | `T`                     | Selected value (v-model)                           |
| `loadFn`      | `() => Promise<T[]>`    | Async function returning options                   |
| `displayKey`  | `keyof T`               | Property to display for each option                |
| `preprocesor` | `(option: T) => string` | Custom display formatter                           |
| `nullText`    | `string`                | Placeholder option text                            |
| `loadingText` | `string`                | Text shown while loading (default: `'Loading...'`) |

---

## Directives

All directives are auto-registered when using `installVf()`:

```typescript
app.use(installVf);
```

### `v-autofocus`

Auto-focuses the element on mount. Works with inputs, buttons, textareas, and selects. For other elements, focuses the first `<input>` child.

```vue
<input v-autofocus />
```

### `v-tooltip`

Displays a tooltip that follows the cursor on hover.

```vue
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

The tooltip auto-positions to stay within the viewport. Style with the `.vf-tooltip` CSS class.

### `v-hotkey`

Binds a keyboard shortcut to programmatically click the element.

```vue
<button v-hotkey="'s'" @click="save">Save</button>
<button v-hotkey="'Enter'" @click="submit">Submit</button>
<button v-hotkey="'Escape'" @click="cancel">Cancel</button>
```

Values match `KeyboardEvent.key`. When multiple elements share a hotkey, the last-mounted element takes precedence. The default browser behavior for the key is prevented.

### `v-datetime`

Formats and displays ISO datetime strings.

```vue
<!-- Default format (from config) -->
<span v-datetime="'2024-01-15T10:30:00Z'"></span>

<!-- Date only -->
<span v-datetime="isoDate" date-only></span>

<!-- Custom format (date-fns syntax) -->
<span v-datetime="isoDate" format="MMM d, yyyy"></span>

<!-- Relative: shows time if today, full date otherwise -->
<span v-datetime="isoDate" relative-date></span>

<!-- Simplified: hides date if today, hides year if current year -->
<span v-datetime="isoDate" simplified-date></span>

<!-- Treat input as local time (don't assume UTC) -->
<span v-datetime="localDate" local></span>

<!-- Display in UTC -->
<span v-datetime="isoDate" display-utc></span>

<!-- Placeholder when null -->
<span v-datetime="null" placeholder="N/A"></span>
```

By default, input is treated as UTC and converted to local time for display.

### `v-date-input`

Parses and normalizes date input on blur. If the user types `1/15`, it appends the current year. Invalid dates are cleared.

```vue
<input v-date-input v-model="dateValue" />
```

Output format: `MM/dd/yyyy`

### `v-duration`

Displays a live-updating duration from a timestamp to now.

```vue
<!-- Duration from timestamp to now -->
<span v-duration="startTimestamp"></span>
<!-- Output: "2h 15m 30s" -->

<!-- With base time reference -->
<span v-duration="startTimestamp" base-time="2024-01-01T00:00:00Z"></span>

<!-- Without seconds -->
<span v-duration="startTimestamp" no-seconds></span>
<!-- Output: "2h 15m" -->
```

Updates every second. Format: `Xd Xh Xm Xs` (zero values are omitted except when all are zero).

### `v-confirm-button`

Requires a second click to confirm an action. On first click, changes button text to "Confirm". Moving the mouse away resets it.

```vue
<!-- Listen for @confirm, not @click -->
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

### `v-infinite-scroll`

Triggers a callback when the element is scrolled to the bottom.

```vue
<div v-infinite-scroll="loadMore" style="overflow: auto; height: 400px;">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>
```

Fires once when reaching the bottom. Resets when scrolled away, allowing it to fire again.

### `v-disabled`

Dynamically sets the `disabled` attribute. When used on a `<label>`, also targets its child `<input>` and toggles a `.disabled` class on the label.

```vue
<input v-disabled="isLoading" />
<label v-disabled="!canEdit"><input type="checkbox" /> Enable feature</label>
```

### `v-readonly`

Dynamically sets the `readonly` attribute. When used on a `<label>`, targets its child `<input>`.

```vue
<input v-readonly="!isEditing" />
```

### `v-sticky-min-width`

Prevents a sticky element from shrinking below its current width. Uses ResizeObserver to track width changes. Can be globally disabled via `configureVf({ disableStickyMinWidthDirective: true })`.

```vue
<th v-sticky-min-width style="position: sticky; top: 0;">Column Header</th>

<!-- Conditionally disable -->
<th v-sticky-min-width="shouldStick">Header</th>
```

---

## Helpers

### Error Handling

```typescript
import { UserError, formatError, toError, isError, handleErrorAndAlert, handleError } from '@signal24/vue-foundation';
```

#### `UserError`

Error subclass for user-facing messages. These are displayed directly to users without generic wrapper text.

```typescript
throw new UserError('Please enter a valid email address');
```

#### `formatError(err)`

Formats any error for display. `UserError` messages are returned as-is. Other errors are wrapped with support text from config.

```typescript
formatError(new UserError('Invalid email'));
// "Invalid email"

formatError(new Error('ECONNREFUSED'));
// "An application error has occurred:\n\nECONNREFUSED\n\nPlease refresh the page and try again. If this error persists, please contact support."
```

#### `handleErrorAndAlert(err, options?)`

Calls the global error handler (for non-UserError), then shows an alert dialog.

```typescript
try {
    await riskyOperation();
} catch (err) {
    await handleErrorAndAlert(err, { title: 'Save Failed', cause: originalError });
}
```

#### `handleError(err, cause?)`

Calls the global error handler without showing UI. Use for background errors.

```typescript
try {
    await backgroundTask();
} catch (err) {
    handleError(err);
}
```

#### `toError(err, cause?)` / `isError(err)`

```typescript
const error = toError('string error'); // Error('string error')
const error = toError(err, originalCause); // sets error.cause

if (isError(value)) {
    /* value is Error */
}
```

---

### Masking

Overlay and form masking utilities for async operations.

#### Component / Element Masking

```typescript
import { maskComponent, unmaskComponent, maskEl, unmaskEl } from '@signal24/vue-foundation';

// Mask a component (finds .vf-modal ancestor for modal components)
const unmask = maskComponent(componentInstance, 'Saving...');
unmask();

// Mask a raw DOM element
const unmask = maskEl(element, 'Loading...');
unmask();
```

Adds a `.vf-mask` overlay div to the element.

#### Form Masking

Disables all inputs and changes the submit button text during async operations.

```typescript
import { maskForm, unmaskForm } from '@signal24/vue-foundation';

const unmask = maskForm(formElement); // default button selector & text
const unmask = maskForm(componentInstance); // finds <form> in component
const unmask = maskForm(form, 'button.submit', 'Saving...'); // custom button & text

// ... async operation ...

unmask(); // restores all inputs and button text
```

Default button selector: `'button:not([disabled]):not([type="button"])'`
Default button text: `'Please wait...'`

Adds `.vf-masked` class to the form element.

---

### Context Menu

Vanilla JS context menu with confirmation support.

```typescript
import { showContextMenu } from '@signal24/vue-foundation';

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
                shouldConfirm: true // requires second click
            }
        ],
        class: 'my-menu', // CSS class on menu element
        targetClass: 'menu-open' // CSS class added to target element while open
    });
}
```

When `shouldConfirm` is `true`, the first click changes the item text to "Confirm". Moving the mouse away resets it. The second click executes the handler.

The menu auto-positions to stay within the viewport. Clicking outside closes it. Style with `.vf-context-menu` CSS class.

---

### String Utilities

```typescript
import { escapeHtml, nl2br, desnakeCase, formatPhone, formatUSCurrency, uuid } from '@signal24/vue-foundation';

escapeHtml('<script>'); // '&lt;script&gt;'
nl2br('line 1\nline 2'); // 'line 1<br>line 2'
desnakeCase('user_name'); // 'user name'
formatPhone('1234567890'); // '(123) 456-7890'
formatPhone('11234567890'); // '(123) 456-7890' (strips leading 1)
formatUSCurrency(1234); // '$1,234.00'
formatUSCurrency(1234, 100); // '$12.34' (divide by 100 first)
uuid(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```

`formatUSCurrency` uses `VfOptions.defaultCurrencyDivisor` when no divisor is passed.

---

### Number Utilities

```typescript
import { formatNumber } from '@signal24/vue-foundation';

formatNumber(12345); // '12,345'
```

---

### Array Utilities

```typescript
import { replaceElement } from '@signal24/vue-foundation';

const items = [1, 2, 3, 4];
replaceElement(items, 2, 20); // true, items = [1, 20, 3, 4]
replaceElement(items, x => x > 10, 99); // true, items = [1, 99, 3, 4]
replaceElement(items, 100, 200); // false (not found)
```

Mutates the array in place. Returns `true` if replaced, `false` if not found.

---

### Object Utilities

```typescript
import {
    cloneProp,
    nullifyEmptyInputs,
    isNotNullOrUndefined,
    objectKeys,
    objectAssign,
    objectEntries,
    extractValues,
    extractUpdates,
    patchObject,
    extractKV
} from '@signal24/vue-foundation';
```

#### `cloneProp(prop, fallback)`

Deep clones a prop value, returning the fallback if null/undefined.

```typescript
const config = cloneProp(props.config, { theme: 'light' });
```

#### `nullifyEmptyInputs(obj, fields)`

Converts empty strings to `null` for specified fields. Returns a new object.

```typescript
nullifyEmptyInputs({ name: 'John', email: '' }, ['email']);
// { name: 'John', email: null }
```

#### `isNotNullOrUndefined(value)`

Type guard that narrows `T | null | undefined` to `T`.

```typescript
const items = [1, null, 2, undefined, 3].filter(isNotNullOrUndefined);
// TypeScript knows: number[]
```

#### `objectKeys(obj)` / `objectAssign(obj, ...values)` / `objectEntries(obj)`

Type-safe wrappers around `Object.keys()`, `Object.assign()`, and `Object.entries()`.

#### `extractValues(state, fields)`

Picks specific fields from an object.

```typescript
extractValues({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```

#### `extractUpdates(state, updates, fields?, method?)`

Returns only the fields in `updates` that differ from `state`.

```typescript
extractUpdates({ a: 1, b: 2 }, { a: 1, b: 3 }); // { b: 3 }
```

`method` can be `'equals'` (deep equality, default) or `'matches'` (partial match via lodash `isMatch`).

#### `patchObject(state, updates, fields?, method?)`

Applies only changed fields from `updates` to `state` (mutates `state`).

```typescript
const state = { a: 1, b: 2, c: 3 };
patchObject(state, { a: 1, b: 5 }); // state = { a: 1, b: 5, c: 3 }
```

#### `extractKV(array, keyCol, valCol)`

Converts an array of objects into a key-value record.

```typescript
const users = [
    { id: 'a', name: 'Alice' },
    { id: 'b', name: 'Bob' }
];
extractKV(users, 'id', 'name'); // { a: 'Alice', b: 'Bob' }
```

---

### Delay Utilities

```typescript
import { sleep, sleepSecs } from '@signal24/vue-foundation';

await sleep(1000); // wait 1 second
await sleepSecs(5); // wait 5 seconds
```

---

### OpenAPI Client Configuration

```typescript
import { configureVfOpenApiClient } from '@signal24/vue-foundation';

configureVfOpenApiClient(apiClient, {
    onError(err, options) {
        console.error('API error:', err);
        return err;
    }
});
```

Automatically converts HTTP 422 responses with `{ error: string }` body into `UserError` instances, so they flow through the standard error handling as user-facing messages.

---

## Hooks

### `useInfiniteScroll(options)`

Composition API hook for infinite scroll detection at multiple levels.

```typescript
import { useInfiniteScroll } from '@signal24/vue-foundation';

useInfiniteScroll({
    elScrolledToBottom: () => loadMore(), // component's root element
    ancestorScrolledToBottom: () => loadMore(), // nearest scrollable ancestor
    windowScrolledToBottom: () => loadMore() // window scroll
});
```

Automatically installs/uninstalls on mount/unmount and handles `keep-alive` activate/deactivate.

### `useResizeWatcher(fn)`

Calls a function on every window resize. Handles mount/unmount and `keep-alive` lifecycle.

```typescript
import { useResizeWatcher } from '@signal24/vue-foundation';

useResizeWatcher(() => {
    recalculateLayout();
});
```

---

## Filters

Display formatting functions, useful in templates.

```typescript
import { createFilters } from '@signal24/vue-foundation';

const $f = createFilters(base => ({
    // Add your own filters alongside the built-in ones
    customFilter: (value: string) => value.toUpperCase()
}));

// Use in templates
$f.date('2024-01-15'); // '1/15/24'
$f.dateTime('2024-01-15T10:30'); // '1/15/24 10:30'
$f.time('2024-01-15T10:30'); // '10:30'
$f.phone('1234567890'); // '(123) 456-7890'
$f.usCurrency(1234); // '$1,234.00'
$f.number(12345); // '12,345'
$f.bytes(1048576); // '1.00 MB'
$f.dash(null); // '-'
$f.dash('value'); // 'value'
$f.dashZeros(0); // '-'
$f.upperFirst('hello'); // 'Hello'
$f.startCase('hello_world'); // 'Hello World'
$f.upperCase('hello'); // 'HELLO'
$f.upperWords('hello world'); // 'Hello World'
$f.desnake('snake_case'); // 'snake case'
$f.divide(1000, 100); // 10
$f.oneDayForward('2024-01-15'); // '1/16/24'
```

---

## TypeScript Types

The library exports several utility types:

```typescript
import type { Branded, BrandOf, Debrand, PickRequired, PickOptional, WithoutNever, UnwrapBrand } from '@signal24/vue-foundation';

// Branded types for nominal typing
type UserId = Branded<'UserId', number>;
const id: UserId = 123 as UserId;

// Extract required/optional keys from a type
type Required = PickRequired<{ a: string; b?: number }>; // { a: string }
type Optional = PickOptional<{ a: string; b?: number }>; // { b?: number }
```

---

## Vite Plugin

### `openapiClientGeneratorPlugin()`

Watches OpenAPI spec files and auto-generates TypeScript client code during development.

```typescript
// vite.config.ts
import { openapiClientGeneratorPlugin } from '@signal24/vue-foundation/vite-plugins';

export default defineConfig({
    plugins: [vue(), openapiClientGeneratorPlugin()]
});
```

**Development only** — runs only during `vite serve`, not during build.

Requires `@signal24/openapi-client-codegen` and an `openapi-clients.json` configuration file:

```json
{
    "clients": [
        {
            "name": "MyApi",
            "spec": "./specs/openapi.yaml",
            "output": "./src/api-client"
        }
    ]
}
```

See `@signal24/openapi-client-codegen` documentation for full configuration options.

---

## CSS Classes Reference

The library uses these CSS classes that you can style:

| Class                      | Used By              | Description                              |
| -------------------------- | -------------------- | ---------------------------------------- |
| `.vf-overlay`              | Modal, context menu  | Fixed full-screen overlay                |
| `.vf-modal-wrap`           | VfModal              | Modal backdrop (semi-transparent)        |
| `.vf-modal`                | VfModal              | Modal container                          |
| `.vf-modal-header`         | VfModal              | Modal header slot container              |
| `.vf-modal-content`        | VfModal              | Modal content slot container             |
| `.vf-modal-footer`         | VfModal              | Modal footer slot container              |
| `.vf-alert`                | VfAlertModal         | Alert modal wrapper                      |
| `.vf-toast`                | VfToast              | Toast container                          |
| `.vf-tooltip`              | v-tooltip            | Tooltip element                          |
| `.vf-mask`                 | maskEl/maskComponent | Component overlay mask                   |
| `.vf-masked`               | maskForm             | Applied to masked forms                  |
| `.vf-smart-select`         | VfSmartSelect        | Select wrapper                           |
| `.vf-smart-select-options` | VfSmartSelect        | Options dropdown                         |
| `.vf-context-menu`         | showContextMenu      | Context menu                             |
| `.vf-overlay-anchor`       | OverlayAnchor        | Anchored overlay wrapper                 |
| `.vf-modal-open`           | VfModal              | Applied to `<body>` when a modal is open |

---

## License

MIT
