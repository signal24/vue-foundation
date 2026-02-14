<template>
    <div data-testid="demo-ss-delayed" style="max-width: 320px">
        <VfSmartSelect
            v-model="value"
            :options="delayedOptions"
            :label-field="'label'"
            :value-field="'value'"
            loading-text="Loading options..."
            null-title="No selection"
        />
        <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ value ?? 'none' }} (options load after 1.5s)</span>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { VfSmartSelect } from '@signal24/vue-foundation';

const options = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' }
];

const delayedOptions = ref<typeof options>();
const value = ref<string | null>(null);

onMounted(() => {
    setTimeout(() => {
        delayedOptions.value = [...options];
    }, 1500);
});
</script>
