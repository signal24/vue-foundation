# VfModal

Base modal shell providing backdrop, layout, and slot structure.

## Import

```typescript
import { VfModal, vfModalRef } from '@signal24/vue-foundation';
```

## Basic Usage

```vue
<VfModal id="my-modal" close-on-mask-click scrolls close-x :class="['wide']">
    <template #header>Modal Title</template>

    <p>Modal content goes here.</p>

    <template #footer>
        <button @click="save">Save</button>
    </template>
</VfModal>
```

## Props

| Prop               | Type                 | Default | Description                                            |
| ------------------ | -------------------- | ------- | ------------------------------------------------------ |
| `id`               | `string`             | --      | HTML id attribute                                      |
| `closeOnMaskClick` | `boolean`            | `false` | Close when clicking backdrop (also enables Escape key) |
| `scrolls`          | `boolean`            | `false` | Enable scrolling in content area                       |
| `closeX`           | `boolean`            | `false` | Show close icon in header                              |
| `class`            | `string \| string[]` | --      | CSS classes on the overlay wrapper                     |
| `onClose`          | `() => void`         | --      | Custom close handler (overrides default dismiss)       |

## Slots

| Slot      | Description          |
| --------- | -------------------- |
| `header`  | Modal header content |
| `default` | Modal body content   |
| `footer`  | Modal footer content |

## Events

| Event        | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| `formSubmit` | The modal wraps content in a `<form>`, so submit events bubble up |

## Exposed Methods

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

## Demo

<DemoContainer>
  <DemoVfModal />
  <template #source>

<<< @/demos/components/DemoVfModal.vue

  </template>
</DemoContainer>

<script setup>
import DemoVfModal from '../demos/components/DemoVfModal.vue';
</script>
