<template>
    <div data-testid="demo-ss-basic" style="max-width: 320px">
        <VfSmartSelect v-model="value" :options="options" :label-field="'label'" :value-field="'value'" placeholder="Pick a fruit or vegetable..." />
        <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ value ?? 'none' }}</span>
    </div>
</template>

<script lang="ts" setup>
import { VfSmartSelect } from '@zyno-io/vue-foundation';
import { ref } from 'vue';

const options = [
    { value: '1', label: 'Apple', group: 'Fruits' },
    { value: '2', label: 'Banana', group: 'Fruits' },
    { value: '3', label: 'Cherry', group: 'Fruits' },
    { value: '4', label: 'Carrot', group: 'Vegetables' },
    { value: '5', label: 'Broccoli', group: 'Vegetables' },
    { value: '6', label: 'Spinach', group: 'Vegetables' }
];

const value = ref<string | null>(null);
</script>
