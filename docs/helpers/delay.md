# Delay

Promise-based delay utilities.

## Import

```typescript
import { sleep, sleepSecs } from '@signal24/vue-foundation';
```

## `sleep(ms)`

Returns a promise that resolves after the given number of milliseconds.

```typescript
await sleep(1000); // wait 1 second
await sleep(500); // wait 500ms
```

## `sleepSecs(secs)`

Returns a promise that resolves after the given number of seconds. Calls `sleep(secs * 1000)` internally.

```typescript
await sleepSecs(5); // wait 5 seconds
await sleepSecs(0.5); // wait 500ms
```
