<template>
    <div data-testid="demo-ss-preselected" style="max-width: 320px">
        <VfSmartSelect v-model="value" :options="options" :label-field="'label'" :value-field="'value'" />
        <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ value }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfSmartSelect } from '@zyno-io/vue-foundation';

const options = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' }
];

const value = ref<string | null>('2');
</script>
