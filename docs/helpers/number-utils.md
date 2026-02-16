# Number Utilities

## Import

```typescript
import { formatNumber } from '@zyno-io/vue-foundation';
```

## `formatNumber(value)`

Formats a number with comma-separated thousands.

```typescript
formatNumber(12345); // '12,345'
formatNumber(1000000); // '1,000,000'
formatNumber(42); // '42'
```
