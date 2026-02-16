<template>
    <div data-testid="demo-ss-create" style="max-width: 320px">
        <VfSmartSelect
            v-model="value"
            :options="effectiveOptions"
            :formatter="o => o.label"
            :value-extractor="o => o.value"
            :on-create-item="handleCreate"
            placeholder="Search or type to create..."
        />
        <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ value ?? 'none' }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { VfSmartSelect } from '@zyno-io/vue-foundation';

interface IOption {
    label: string;
    value: string;
}

const options: IOption[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' }
];

const value = ref<string | null>(null);
const createdLabel = ref<string>();

const effectiveOptions = computed<IOption[]>(() => {
    if (createdLabel.value) {
        return [{ value: 'new', label: createdLabel.value }, ...options];
    }
    return options;
});

function handleCreate(text: string) {
    createdLabel.value = text;
    value.value = 'new';
}
</script>
