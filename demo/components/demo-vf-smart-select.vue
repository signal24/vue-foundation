<template>
    <div id="demo-vf-smart-select">
        <div>
            <VfSmartSelect v-model="selectedInstantOption1" :options="instantOptions" label-field="label" />

            Selected value label: {{ selectedInstantOption1?.label ?? '-' }}
        </div>

        <div>
            <VfSmartSelect
                v-model="selectedInstantOption2"
                :options="instantOptions"
                label-field="label"
                group-field="group"
                null-title="No selection"
            />

            Selected value label: {{ selectedInstantOption2?.label ?? '-' }}
        </div>

        <div>
            <VfSmartSelect
                v-model="selectedDelayedOption1"
                :options="delayedOptions"
                label-field="label"
                group-field="group"
                null-title="No selection"
            />

            Selected value label: {{ selectedDelayedOption1?.label ?? '-' }}
        </div>

        <div>
            <VfSmartSelect
                v-model="selectedDelayedOption2"
                :options="delayedOptions"
                label-field="label"
                value-field="value"
                group-field="group"
                null-title="No selection"
            />

            Selected value: {{ selectedDelayedOption2 ?? '-' }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { onMounted, ref } from 'vue';

import VfSmartSelect from '@/components/vf-smart-select.vue';

interface IOption {
    label: string;
    value: string;
    group?: string;
}
const options: IOption[] = [
    { value: '1', label: 'Option 1', group: 'Set 1' },
    { value: '2', label: 'Option 2', group: 'Set 1' },
    { value: '3', label: 'Option 3', group: 'Set 1' },
    { value: '4', label: 'Option 4', group: 'Set 1' },
    { value: '5', label: 'Option 5', group: 'Set 1' },
    { value: '6', label: 'Option 6', group: 'Set 2' },
    { value: '7', label: 'Option 7', group: 'Set 2' },
    { value: '8', label: 'Option 8', group: 'Set 2' },
    { value: '9', label: 'Option 9', group: 'Set 2' },
    { value: '10', label: 'Option 10', group: 'Set 2' }
];

const instantOptions = ref<IOption[]>(cloneDeep(options));
const delayedOptions = ref<IOption[]>();

const selectedInstantOption1 = ref<IOption | null>(null);
const selectedInstantOption2 = ref<IOption | null>(null);
const selectedDelayedOption1 = ref<IOption | null>(options[1]);
const selectedDelayedOption2 = ref<string | null>(options[1].value);

function setDelayedOptions() {
    delayedOptions.value = cloneDeep(options);
}

onMounted(() => setTimeout(setDelayedOptions, 1000));
</script>

<style lang="scss" scoped>
#demo-vf-smart-select {
    max-width: 450px;

    > div {
        margin-top: 12px;
    }
}
</style>
