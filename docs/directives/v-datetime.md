# v-datetime

Formats and displays ISO datetime strings. By default, input is treated as UTC and converted to local time for display.

## Usage

```vue
<!-- Default format (from config) -->
<span v-datetime="'2024-01-15T10:30:00Z'"></span>

<!-- Date only -->
<span v-datetime="isoDate" date-only></span>

<!-- Custom format (date-fns syntax) -->
<span v-datetime="isoDate" format="MMM d, yyyy"></span>

<!-- Relative: shows time if today, full date otherwise -->
<span v-datetime="isoDate" relative-date></span>

<!-- Simplified: hides date if today, hides year if current year -->
<span v-datetime="isoDate" simplified-date></span>

<!-- Treat input as local time (don't assume UTC) -->
<span v-datetime="localDate" local></span>

<!-- Display in UTC -->
<span v-datetime="isoDate" display-utc></span>

<!-- Placeholder when null -->
<span v-datetime="null" placeholder="N/A"></span>
```

## Modifiers

| Attribute         | Description                                   |
| ----------------- | --------------------------------------------- |
| `date-only`       | Show date without time                        |
| `format`          | Custom date-fns format string                 |
| `relative-date`   | Show time if today, full date otherwise       |
| `simplified-date` | Hide date if today, hide year if current year |
| `local`           | Treat input as local time instead of UTC      |
| `display-utc`     | Display the output in UTC                     |
| `placeholder`     | Text to show when the value is null           |

## Demo

<DemoContainer>
  <DemoDatetime />
  <template #source>

<<< @/demos/directives/DemoDatetime.vue

  </template>
</DemoContainer>

<script setup>
import DemoDatetime from '../demos/directives/DemoDatetime.vue';
</script>
