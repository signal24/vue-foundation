# Array Utilities

## Import

```typescript
import { replaceElement } from '@signal24/vue-foundation';
```

## `replaceElement(array, oldElement, newElement)`

Finds and replaces an element in an array in place. The second argument can be a value (matched by reference via `indexOf`) or a predicate function (matched via `findIndex`). Returns `true` if replaced, `false` if not found.

```typescript
const items = [1, 2, 3, 4];

replaceElement(items, 2, 20);
// true, items is now [1, 20, 3, 4]

replaceElement(items, x => x > 10, 99);
// true, items is now [1, 99, 3, 4]

replaceElement(items, 100, 200);
// false (100 not found, array unchanged)
```

**Type signature:**

```typescript
function replaceElement<T>(array: T[], oldElement: T | ((value: T, index: number, array: T[]) => boolean), newElement: T): boolean;
```
