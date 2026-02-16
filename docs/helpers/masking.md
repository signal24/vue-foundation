# Masking

Overlay and form masking utilities for disabling UI during async operations.

## Import

```typescript
import { maskComponent, unmaskComponent, maskEl, unmaskEl, maskForm, unmaskForm } from '@zyno-io/vue-foundation';
```

## Component / Element Masking

These functions add a `.vf-mask` overlay `<div>` on top of an element, visually blocking interaction.

### `maskComponent(instance, message?)`

Masks a component instance. If the component is inside a `.vf-modal`, the entire modal is masked instead.

```typescript
const unmask = maskComponent(componentInstance, 'Saving...');
// ... async work ...
unmask();
```

### `unmaskComponent(instance)`

Removes the mask from a previously masked component.

```typescript
unmaskComponent(componentInstance);
```

### `maskEl(element, message?)`

Masks a raw DOM element by appending a `.vf-mask` child. Returns an unmask function.

```typescript
const unmask = maskEl(element, 'Loading...');
// ... async work ...
unmask();
```

::: tip
The element should have `position: relative` (or `absolute`/`fixed`) so the mask overlay positions correctly on top of it.
:::

### `unmaskEl(element)`

Removes the mask from a previously masked element.

```typescript
unmaskEl(element);
```

## Form Masking

Form masking disables all inputs within a form and changes the submit button text during async operations.

### `maskForm(formOrComponent, buttonSelector?, buttonText?)`

Disables all inputs, selects, textareas, and buttons inside a form element. Changes the submit button text to a waiting message. Adds the `.vf-masked` CSS class to the form. Returns an unmask function.

```typescript
// Using a form element
const unmask = maskForm(formElement);

// Using a component instance (finds the <form> within)
const unmask = maskForm(componentInstance);

// With custom button selector and text
const unmask = maskForm(form, 'button.submit', 'Saving...');

// ... async operation ...
unmask(); // restores all inputs and button text
```

| Parameter        | Type                                 | Default                                         |
| ---------------- | ------------------------------------ | ----------------------------------------------- |
| `formOrCmp`      | `Element \| ComponentPublicInstance` | (required)                                      |
| `buttonSelector` | `string \| Element`                  | `'button:not([disabled]):not([type="button"])'` |
| `buttonText`     | `string`                             | `'Please wait...'`                              |

### `unmaskForm(formOrComponent)`

Restores a previously masked form: re-enables all inputs, restores button text, and removes the `.vf-masked` class.

```typescript
unmaskForm(formElement);
```

## Demo

<DemoContainer>
  <DemoMasking />
  <template #source>

<<< @/demos/helpers/DemoMasking.vue

  </template>
</DemoContainer>

<script setup>
import DemoMasking from '../demos/helpers/DemoMasking.vue';
</script>
