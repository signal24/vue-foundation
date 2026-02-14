# String Utilities

Pure utility functions for common string formatting operations.

## Import

```typescript
import { escapeHtml, nl2br, desnakeCase, formatPhone, formatUSCurrency, uuid } from '@signal24/vue-foundation';
```

## `escapeHtml(value)`

Escapes HTML special characters (`<`, `>`, `&`, `"`, `'`) to their entity equivalents. Re-exported from `@vue/shared`.

```typescript
escapeHtml('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

## `nl2br(value)`

Replaces newline characters (`\n`) with `<br>` tags.

```typescript
nl2br('line 1\nline 2');
// 'line 1<br>line 2'
```

## `desnakeCase(value)`

Replaces underscores with spaces.

```typescript
desnakeCase('user_name'); // 'user name'
desnakeCase('created_at'); // 'created at'
```

## `formatPhone(value)`

Formats a US phone number string into `(XXX) XXX-XXXX` format. Non-digit characters are stripped. A leading `1` (country code) is removed before formatting. If the cleaned number does not have exactly 10 digits, the original value is returned unchanged.

```typescript
formatPhone('1234567890'); // '(123) 456-7890'
formatPhone('11234567890'); // '(123) 456-7890'
formatPhone('123-456-7890'); // '(123) 456-7890'
formatPhone('12345'); // '12345' (not 10 digits)
```

## `formatUSCurrency(value, divisor?)`

Formats a number or string as US currency. If `divisor` is provided, the value is divided by it before formatting. When no divisor is passed, the `defaultCurrencyDivisor` from `configureVf()` is used (defaults to `1`).

```typescript
formatUSCurrency(1234); // '$1,234.00'
formatUSCurrency(1234, 100); // '$12.34'
formatUSCurrency('5000'); // '$5,000.00'
```

## `uuid()`

Generates a v4 UUID string.

```typescript
uuid(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```
