import type { OptionalKeysOf, RequiredKeysOf } from 'type-fest';

export type Branded<T, A> = A & { __brand: T };
export type BrandOf<A> = [A] extends [Branded<infer R, unknown>] ? R : never;
export type Debrand<A> = A extends Branded<BrandOf<A>, infer R> ? R : never;

export type PickRequired<T> = T extends object ? Pick<T, RequiredKeysOf<T>> : never;
export type PickOptional<T> = T extends object ? Pick<T, OptionalKeysOf<T>> : never;

export type WithoutNever<T> = { [P in keyof T as T[P] extends never ? never : P]: T[P] };

export type UnwrapBrand<T, B> = WithoutNever<{
    [K in keyof T]: BrandOf<T[K]> extends B ? Debrand<T[K]> : never;
}>;
