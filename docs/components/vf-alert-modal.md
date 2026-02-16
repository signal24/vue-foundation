# Alert & Confirm Helpers

Pre-built alert and confirm dialogs built on top of the overlay system.

## Import

```typescript
import { showAlert, showConfirm, showConfirmDestroy, showWait, showMutableWait } from '@zyno-io/vue-foundation';
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

<DemoContainer>
  <DemoShowAlert />
  <template #source>

<<< @/demos/components/DemoShowAlert.vue

  </template>
</DemoContainer>

## `showConfirm(message)` / `showConfirm(title, message)` / `showConfirm(options)`

Shows a confirm dialog with Confirm/Cancel buttons. Returns `true` or `false`.

```typescript
const ok = await showConfirm('Are you sure?');
const ok = await showConfirm('Delete Item', 'This cannot be undone.');
```

<DemoContainer>
  <DemoShowConfirm />
  <template #source>

<<< @/demos/components/DemoShowConfirm.vue

  </template>
</DemoContainer>

## `showConfirmDestroy(message)` / `showConfirmDestroy(title, message)` / `showConfirmDestroy(options)`

Same as `showConfirm` but with destructive styling (red Confirm button).

```typescript
const ok = await showConfirmDestroy('Delete this record permanently?');
```

<DemoContainer>
  <DemoShowConfirmDestroy />
  <template #source>

<<< @/demos/components/DemoShowConfirmDestroy.vue

  </template>
</DemoContainer>

## `showWait(message)` / `showWait(title, message)` / `showWait(options)`

Shows a non-dismissible wait overlay. Returns a dismiss function.

```typescript
const dismiss = showWait('Processing...');
await longOperation();
dismiss();
```

<DemoContainer>
  <DemoShowWait />
  <template #source>

<<< @/demos/components/DemoShowWait.vue

  </template>
</DemoContainer>

## `showMutableWait(message)` / `showMutableWait(title, message)` / `showMutableWait(options)`

Shows a wait overlay whose message can be updated. Returns `{ update, dismiss }`.

```typescript
const wait = showMutableWait('Starting...');
wait.update('Step 1 of 3...');
wait.update('Step 2 of 3...');
wait.update('Finishing...');
wait.dismiss();
```

<DemoContainer>
  <DemoShowMutableWait />
  <template #source>

<<< @/demos/components/DemoShowMutableWait.vue

  </template>
</DemoContainer>

## Stacked Overlays

Overlays can be sequenced by awaiting each call.

<DemoContainer>
  <DemoOverlayStacking />
  <template #source>

<<< @/demos/components/DemoOverlayStacking.vue

  </template>
</DemoContainer>

<script setup>
import DemoShowAlert from '../demos/components/DemoShowAlert.vue';
import DemoShowConfirm from '../demos/components/DemoShowConfirm.vue';
import DemoShowConfirmDestroy from '../demos/components/DemoShowConfirmDestroy.vue';
import DemoShowWait from '../demos/components/DemoShowWait.vue';
import DemoShowMutableWait from '../demos/components/DemoShowMutableWait.vue';
import DemoOverlayStacking from '../demos/components/DemoOverlayStacking.vue';
</script>
