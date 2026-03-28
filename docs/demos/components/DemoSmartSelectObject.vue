<template>
    <div data-testid="demo-ss-object" style="max-width: 320px">
        <VfSmartSelect v-model="value" :options="options" :label-field="'label'" placeholder="Select an option..." />
        <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ value ? value.label : 'none' }}</span>
    </div>
</template>

<script lang="ts" setup>
import { VfSmartSelect } from '@zyno-io/vue-foundation';
import { ref } from 'vue';

interface IOption {
    label: string;
    value: string;
}

const options: IOption[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' }
];

const value = ref<IOption | null>(null);
</script>
