# Object Utilities

A collection of type-safe object manipulation helpers.

## Import

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
} from '@zyno-io/vue-foundation';
```

## `cloneProp(prop, fallback)`

Deep clones a prop value using lodash `cloneDeep`. If the prop is `null` or `undefined`, the fallback value is returned instead.

```typescript
const config = cloneProp(props.config, { theme: 'light' });
// Deep clone of props.config, or { theme: 'light' } if null/undefined
```

## `nullifyEmptyInputs(obj, fields)`

Returns a new object where empty strings in the specified fields are replaced with `null`. Useful for cleaning form data before submission.

```typescript
nullifyEmptyInputs({ name: 'John', email: '', phone: '' }, ['email', 'phone']);
// { name: 'John', email: null, phone: null }
```

## `isNotNullOrUndefined(value)`

Type guard that narrows `T | null | undefined` to `T`. Commonly used with `Array.filter()`.

```typescript
const items = [1, null, 2, undefined, 3].filter(isNotNullOrUndefined);
// TypeScript infers: number[]
// Result: [1, 2, 3]
```

## `objectKeys(obj)`

Type-safe wrapper around `Object.keys()` that returns `(keyof T)[]` instead of `string[]`.

```typescript
const user = { name: 'Alice', age: 30 };
const keys = objectKeys(user); // ('name' | 'age')[]
```

## `objectAssign(obj, ...values)`

Type-safe wrapper around `Object.assign()`.

```typescript
const state = { a: 1, b: 2 };
objectAssign(state, { b: 3 }); // state is now { a: 1, b: 3 }
```

## `objectEntries(obj)`

Type-safe wrapper around `Object.entries()` that preserves key and value types instead of returning `[string, unknown][]`.

```typescript
const user = { name: 'Alice', age: 30 };
const entries = objectEntries(user); // ['name', string] | ['age', number])[]
```

## `extractValues(state, fields)`

Picks specific fields from an object. Similar to lodash `pick`.

```typescript
extractValues({ a: 1, b: 2, c: 3 }, ['a', 'c']);
// { a: 1, c: 3 }
```

## `extractUpdates(state, updates, fields?, method?)`

Compares `updates` against `state` and returns only the fields that have changed. Useful for PATCH requests where you only want to send modified fields.

```typescript
extractUpdates({ a: 1, b: 2, c: 3 }, { a: 1, b: 5, c: 3 });
// { b: 5 }
```

| Parameter | Type                    | Default    | Description                            |
| --------- | ----------------------- | ---------- | -------------------------------------- |
| `state`   | `T`                     | (required) | Original state object                  |
| `updates` | `Partial<T>`            | (required) | Object with potentially updated values |
| `fields`  | `(keyof T)[]`           | all keys   | Restrict comparison to specific fields |
| `method`  | `'equals' \| 'matches'` | `'equals'` | Comparison strategy (see below)        |

**Comparison methods:**

- `'equals'` (default) -- deep equality via lodash `isEqual`
- `'matches'` -- partial match via lodash `isMatch` (for nested objects, checks that `original` contains `updated`)

## `patchObject(state, updates, fields?, method?)`

Applies only the changed fields from `updates` to `state`, mutating `state` in place. Uses `extractUpdates` internally.

```typescript
const state = { a: 1, b: 2, c: 3 };
patchObject(state, { a: 1, b: 5 });
// state is now { a: 1, b: 5, c: 3 }
```

Takes the same parameters as `extractUpdates`.

## `extractKV(array, keyCol, valCol)`

Converts an array of objects into a key-value record by extracting the specified key and value columns.

```typescript
const users = [
    { id: 'a', name: 'Alice' },
    { id: 'b', name: 'Bob' }
];
extractKV(users, 'id', 'name');
// { a: 'Alice', b: 'Bob' }
```
