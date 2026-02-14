# Utility Types

TypeScript utility types exported by the library for nominal typing (branded types) and object key manipulation.

## Import

```typescript
import type { Branded, BrandOf, Debrand, PickRequired, PickOptional, WithoutNever, UnwrapBrand } from '@signal24/vue-foundation';
```

## Branded Types

Branded types (also called nominal types or opaque types) let you distinguish values that share the same underlying primitive type. TypeScript uses structural typing, so `number` is `number` everywhere. Branding adds a phantom `__brand` property to make two types incompatible even when their underlying type is the same.

### `Branded<Tag, BaseType>`

Creates a branded type by intersecting `BaseType` with `{ __brand: Tag }`.

```typescript
type UserId = Branded<'UserId', number>;
type PostId = Branded<'PostId', number>;

const userId: UserId = 123 as UserId;
const postId: PostId = 456 as PostId;

// Type error: UserId is not assignable to PostId
// const wrong: PostId = userId;
```

### `BrandOf<T>`

Extracts the brand tag from a branded type.

```typescript
type UserId = Branded<'UserId', number>;
type Tag = BrandOf<UserId>; // 'UserId'
```

### `Debrand<T>`

Removes the brand from a branded type, returning the underlying base type.

```typescript
type UserId = Branded<'UserId', number>;
type Raw = Debrand<UserId>; // number
```

### `UnwrapBrand<T, Brand>`

Given an object type `T` and a brand tag `Brand`, produces a new type containing only the keys whose values carry that brand, with the brand removed.

```typescript
type UserId = Branded<'UserId', number>;
type PostId = Branded<'PostId', number>;

interface Ids {
    userId: UserId;
    postId: PostId;
    name: string;
}

type UserIdFields = UnwrapBrand<Ids, 'UserId'>;
// { userId: number }
```

## Object Key Utilities

### `PickRequired<T>`

Picks only the required keys from an object type.

```typescript
interface User {
    id: number;
    name: string;
    email?: string;
    phone?: string;
}

type RequiredFields = PickRequired<User>;
// { id: number; name: string }
```

### `PickOptional<T>`

Picks only the optional keys from an object type.

```typescript
interface User {
    id: number;
    name: string;
    email?: string;
    phone?: string;
}

type OptionalFields = PickOptional<User>;
// { email?: string; phone?: string }
```

### `WithoutNever<T>`

Removes keys whose values are `never` from an object type.

```typescript
type Cleaned = WithoutNever<{
    a: string;
    b: never;
    c: number;
}>;
// { a: string; c: number }
```

This type is used internally by `UnwrapBrand` but is also useful on its own when building mapped types that conditionally assign `never` to keys you want to exclude.
