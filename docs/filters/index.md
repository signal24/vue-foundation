# Filters

Display formatting functions for use in templates. Created via a factory function that supports extending the built-in set with custom filters.

## Import

```typescript
import { createFilters } from '@zyno-io/vue-foundation';
```

## `createFilters(factory?)`

Creates a filters object containing all built-in filter functions plus any custom ones you add. The factory receives the built-in filters as an argument so you can reference or wrap them.

```typescript
const $f = createFilters(base => ({
    // Add custom filters alongside the built-ins
    percentage: (value: number) => `${value}%`,
    fullName: (first: string, last: string) => `${first} ${last}`
}));
```

Use the returned object in templates:

```vue
<template>
    <span>{{ $f.date(createdAt) }}</span>
    <span>{{ $f.phone(user.phone) }}</span>
    <span>{{ $f.percentage(95) }}</span>
</template>
```

## Built-in Filters

### `$f.date(value, format?)`

Formats a date string using the configured default date format (or a custom date-fns format string).

```typescript
$f.date('2024-01-15'); // '1/15/24'
$f.date('2024-01-15', 'MMM d, yyyy'); // 'Jan 15, 2024'
```

### `$f.time(value, format?)`

Formats a date string showing only the time portion.

```typescript
$f.time('2024-01-15T10:30:00'); // '10:30'
```

### `$f.dateTime(value, format?)`

Formats a date string showing both date and time.

```typescript
$f.dateTime('2024-01-15T10:30:00'); // '1/15/24 10:30'
```

### `$f.phone(value)`

Formats a US phone number string.

```typescript
$f.phone('1234567890'); // '(123) 456-7890'
```

### `$f.usCurrency(value, divisor?)`

Formats a number as US currency.

```typescript
$f.usCurrency(1234); // '$1,234.00'
$f.usCurrency(1234, 100); // '$12.34'
```

### `$f.number(value)`

Formats a number with comma-separated thousands.

```typescript
$f.number(12345); // '12,345'
```

### `$f.bytes(value)`

Formats a byte count into a human-readable size string.

```typescript
$f.bytes(1048576); // '1.00 MB'
$f.bytes(1073741824); // '1.00 GB'
$f.bytes(512); // '512.00 B'
```

### `$f.dash(value)`

Returns the value if it is non-null, non-undefined, and non-empty. Otherwise returns `'-'`.

```typescript
$f.dash(null); // '-'
$f.dash(''); // '-'
$f.dash('hello'); // 'hello'
```

### `$f.dashZeros(value)`

Returns the value if it is truthy. Otherwise returns `'-'`. Useful for replacing `0` with a dash.

```typescript
$f.dashZeros(0); // '-'
$f.dashZeros(null); // '-'
$f.dashZeros(42); // 42
```

### `$f.upperFirst(value)`

Capitalizes the first character of a string.

```typescript
$f.upperFirst('hello'); // 'Hello'
```

### `$f.startCase(value)`

Converts a string to start case (each word capitalized).

```typescript
$f.startCase('hello_world'); // 'Hello World'
```

### `$f.upperCase(value)`

Converts a string to all uppercase.

```typescript
$f.upperCase('hello'); // 'HELLO'
```

### `$f.upperWords(value)`

Lowercases the string then applies start case.

```typescript
$f.upperWords('hello world'); // 'Hello World'
```

### `$f.desnake(value)`

Replaces underscores with spaces.

```typescript
$f.desnake('snake_case'); // 'snake case'
```

### `$f.divide(value, divisor)`

Divides a number by the given divisor, returning the numeric result.

```typescript
$f.divide(1000, 100); // 10
```

### `$f.oneDayForward(date)`

Parses a `yyyy-MM-dd` date string, adds one day, and formats it with the default date format.

```typescript
$f.oneDayForward('2024-01-15'); // '1/16/24'
```

## Demo

<DemoContainer>
  <DemoFilters />
  <template #source>

<<< @/demos/filters/DemoFilters.vue

  </template>
</DemoContainer>

<script setup>
import DemoFilters from '../demos/filters/DemoFilters.vue';
</script>
