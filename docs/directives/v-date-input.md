# v-date-input

Parses and normalizes date input on blur. If the user types a partial date like `1/15`, it appends the current year. Invalid dates are cleared.

## Usage

```vue
<input v-date-input v-model="dateValue" />
```

Output format: `MM/dd/yyyy`

## Demo

<DemoContainer>
  <DemoDateInput />
  <template #source>

<<< @/demos/directives/DemoDateInput.vue

  </template>
</DemoContainer>

<script setup>
import DemoDateInput from '../demos/directives/DemoDateInput.vue';
</script>
