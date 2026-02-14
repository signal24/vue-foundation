<template>
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 320px">
        <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Basic with label-field</label>
            <VfSmartSelect
                v-model="basicValue"
                :options="options"
                :label-field="'label'"
                :value-field="'value'"
                placeholder="Pick a fruit or vegetable..."
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ basicValue ?? 'none' }}</span>
        </div>

        <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">With groups</label>
            <VfSmartSelect
                v-model="groupedValue"
                :options="options"
                :label-field="'label'"
                :value-field="'value'"
                :group-field="'group'"
                placeholder="Grouped options..."
                null-title="Clear selection"
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ groupedValue ?? 'none' }}</span>
        </div>

        <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Full object value (no value-field)</label>
            <VfSmartSelect v-model="objectValue" :options="options" :label-field="'label'" placeholder="Select an option..." />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ objectValue ? objectValue.label : 'none' }}</span>
        </div>

        <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Async loadOptions</label>
            <VfSmartSelect
                v-model="asyncValue"
                :load-options="loadOptionsAsync"
                :label-field="'label'"
                :value-field="'value'"
                preload
                placeholder="Loaded async..."
                loading-text="Fetching options..."
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ asyncValue ?? 'none' }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfSmartSelect } from '@signal24/vue-foundation';

interface IOption {
    label: string;
    value: string;
    group?: string;
}

const options: IOption[] = [
    { value: '1', label: 'Apple', group: 'Fruits' },
    { value: '2', label: 'Banana', group: 'Fruits' },
    { value: '3', label: 'Carrot', group: 'Vegetables' },
    { value: '4', label: 'Broccoli', group: 'Vegetables' }
];

const basicValue = ref<string | null>(null);
const groupedValue = ref<string | null>(null);
const objectValue = ref<IOption | null>(null);
const asyncValue = ref<string | null>(null);

async function loadOptionsAsync(): Promise<IOption[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { value: 'a', label: 'Async Option A' },
        { value: 'b', label: 'Async Option B' },
        { value: 'c', label: 'Async Option C' }
    ];
}
</script>
