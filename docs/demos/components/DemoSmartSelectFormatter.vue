<template>
    <div style="max-width: 320px">
        <VfSmartSelect
            v-model="value"
            :options="options"
            :formatter="o => `${o.label} (${o.group})`"
            :value-extractor="o => o.value"
            placeholder="Select..."
        />
        <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ value ?? 'none' }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfSmartSelect } from '@signal24/vue-foundation';

const options = [
    { value: '1', label: 'Apple', group: 'Fruits' },
    { value: '2', label: 'Banana', group: 'Fruits' },
    { value: '3', label: 'Carrot', group: 'Vegetables' }
];

const value = ref<string | null>(null);
</script>
