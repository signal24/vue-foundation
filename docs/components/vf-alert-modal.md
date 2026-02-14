# Alert & Confirm Helpers

Pre-built alert and confirm dialogs built on top of the overlay system.

## Import

```typescript
import { showAlert, showConfirm, showConfirmDestroy, showWait, showMutableWait } from '@signal24/vue-foundation';
```

## `showAlert(message)` / `showAlert(title, message)` / `showAlert(options)`

Shows an alert dialog with an OK button. Returns a Promise that resolves when dismissed.

```typescript
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

## `showConfirm(message)` / `showConfirm(title, message)` / `showConfirm(options)`

Shows a confirm dialog with Confirm/Cancel buttons. Returns `true` or `false`.

```typescript
const ok = await showConfirm('Are you sure?');
const ok = await showConfirm('Delete Item', 'This cannot be undone.');
```

## `showConfirmDestroy(message)` / `showConfirmDestroy(title, message)` / `showConfirmDestroy(options)`

Same as `showConfirm` but with destructive styling (red Confirm button).

```typescript
const ok = await showConfirmDestroy('Delete this record permanently?');
```

## `showWait(message)` / `showWait(title, message)` / `showWait(options)`

Shows a non-dismissible wait overlay. Returns a dismiss function.

```typescript
const dismiss = showWait('Processing...');
await longOperation();
dismiss();
```

## `showMutableWait(message)` / `showMutableWait(title, message)` / `showMutableWait(options)`

Shows a wait overlay whose message can be updated. Returns `{ update, dismiss }`.

```typescript
const wait = showMutableWait('Starting...');
wait.update('Step 1 of 3...');
wait.update('Step 2 of 3...');
wait.update('Finishing...');
wait.dismiss();
```

## Demo

<DemoContainer>
  <DemoAlertHelpers />
  <template #source>

<<< @/demos/components/DemoAlertHelpers.vue

  </template>
</DemoContainer>

<script setup>
import DemoAlertHelpers from '../demos/components/DemoAlertHelpers.vue';
</script>
