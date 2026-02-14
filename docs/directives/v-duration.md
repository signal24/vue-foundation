# v-duration

Displays a live-updating duration from a timestamp to now. Updates every second.

## Usage

```vue
<!-- Duration from timestamp to now -->
<span v-duration="startTimestamp"></span>
<!-- Output: "2h 15m 30s" -->

<!-- With base time reference -->
<span v-duration="startTimestamp" base-time="2024-01-01T00:00:00Z"></span>

<!-- Without seconds -->
<span v-duration="startTimestamp" no-seconds></span>
<!-- Output: "2h 15m" -->
```

Format: `Xd Xh Xm Xs` (zero values are omitted except when all are zero).

## Modifiers

| Attribute    | Description                            |
| ------------ | -------------------------------------- |
| `base-time`  | Custom reference time instead of "now" |
| `no-seconds` | Omit seconds from the output           |

## Demo

<DemoContainer>
  <DemoDuration />
  <template #source>

<<< @/demos/directives/DemoDuration.vue

  </template>
</DemoContainer>

<script setup>
import DemoDuration from '../demos/directives/DemoDuration.vue';
</script>
