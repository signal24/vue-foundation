<template>
    <div id="demo-vf-smart-select">
        <div>
            <b>Local options + label field</b>
            <VfSmartSelect v-model="selectedInstantOption1" :options="instantOptions" label-field="label" />
            Selected value label: {{ selectedInstantOption1?.label ?? '-' }}
        </div>

        <div>
            <b>Local options + label field + group + null title</b>
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
            <b>Local delayed options + label field + group + null title</b>
            <VfSmartSelect
                v-model="selectedInstantOption2"
                :options="delayedOptions"
                label-field="label"
                group-field="group"
                null-title="No selection"
            />
            Selected value label: {{ selectedInstantOption2?.label ?? '-' }}
        </div>

        <div>
            <b>Local delayed options + label field + group + null title + preselected</b>
            <VfSmartSelect
                v-model="selectedDelayedOption1"
                :options="delayedOptions"
                label-field="label"
                group-field="group"
                null-title="No selection"
                @update:model-value="logModelValueChange"
            />
            Selected value label: {{ selectedDelayedOption1?.label ?? '-' }}
        </div>

        <div>
            <b>Local delayed options + value field + label field + group + null title + preselected</b>
            <VfSmartSelect
                v-model="selectedDelayedOption2"
                :options="delayedOptions"
                label-field="label"
                value-field="value"
                group-field="group"
                null-title="No selection"
                @update:model-value="logModelValueChange"
            />
            Selected value: {{ selectedDelayedOption2 ?? '-' }}
        </div>

        <div>
            <b>Local delayed options + value field + label field + group + null title</b>
            <VfSmartSelect
                v-model="selectedDelayedOption3"
                :options="delayedOptions"
                label-field="label"
                value-field="value"
                group-field="group"
                null-title="No selection"
            />
            Selected value: {{ selectedDelayedOption3 ?? '-' }}
        </div>

        <div>
            <b>Local delayed options + formatter + create item</b>
            <VfSmartSelect
                v-model="selectedCreateOption"
                :options="createOptions"
                :formatter="o => o.label"
                :value-extractor="o => o.value"
                :on-create-item="createOption"
                :show-create-text-on-new-item="true"
            />
            Selected value: {{ selectedCreateOption ?? '-' }}
        </div>

        <div>
            <b>Load options + formatter + value extractor</b>
            <VfSmartSelect v-model="selectedLoadedOption" :load-options="loadOptions" :formatter="o => o.label" :value-extractor="o => o.value" />
            Selected value: {{ selectedLoadedOption ?? '-' }}
        </div>

        <div>
            <b>Load options + formatter + value extractor + placeholder</b>
            <VfSmartSelect
                v-model="selectedLoadedOption"
                :load-options="loadOptions"
                :formatter="o => o.label"
                :value-extractor="o => o.value"
                placeholder="Select an option"
            />
            Selected value: {{ selectedLoadedOption ?? '-' }}
        </div>

        <div>
            <b>Load options (w/ preload) + formatter + value extractor</b>
            <VfSmartSelect
                v-model="selectedLoadedOption"
                :load-options="loadOptions"
                :formatter="o => o.label"
                :value-extractor="o => o.value"
                preload
            />
            Selected value: {{ selectedLoadedOption ?? '-' }}
        </div>

        <div>
            <b>Load options (w/ preload)</b>
            <VfSmartSelect
                v-model="selectedLoadedOption"
                :load-options="loadOptions"
                :formatter="o => o.label"
                :value-extractor="o => o.value"
                preload
                placeholder="Select an option"
            />
            Selected value: {{ selectedLoadedOption ?? '-' }}
        </div>

        <div>
            <b>Load options (no preload) with predefined value + value field</b>
            <VfSmartSelect v-model="selectedLoadedOption2" :load-options="loadOptions" :formatter="o => o.label" :value-extractor="o => o.value" />
            Selected value: {{ selectedLoadedOption2 ?? '-' }}
        </div>

        <div>
            <b>Load options (w/ preload) with predefined value + value field</b>
            <VfSmartSelect
                v-model="selectedLoadedOption2"
                :load-options="loadOptions"
                :formatter="o => o.label"
                :value-extractor="o => o.value"
                preload
            />
            Selected value: {{ selectedLoadedOption2 ?? '-' }}
        </div>

        <div>
            <b>Load options (no preload) with predefined value</b>
            <VfSmartSelect v-model="selectedLoadedOption3" :load-options="loadOptions" :formatter="o => o.label" />
            Selected value: {{ selectedLoadedOption3 ?? '-' }}
        </div>

        <div>
            <b>Load options (w/ preload) with predefined value</b>
            <VfSmartSelect v-model="selectedLoadedOption3" :load-options="loadOptions" :formatter="o => o.label" preload />
            Selected value: {{ selectedLoadedOption3 ?? '-' }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep, compact } from 'lodash';
import { computed, onMounted, ref } from 'vue';

import VfSmartSelect from '@/components/vf-smart-select.vue';
import { sleepSecs } from '@/helpers';

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
const selectedDelayedOption2 = ref<string | null>('2');
const selectedDelayedOption3 = ref<string | null>('19'); // intentionally invalid value
const selectedCreateOption = ref<string | null>(null);
const selectedLoadedOption = ref<string | null>(null);
const selectedLoadedOption2 = ref<string | null>('5');
const selectedLoadedOption3 = ref<IOption | null>({ value: '5', label: 'Option 5', group: 'Set 1' });

const createdOptionTitle = ref<string>();
const createOptions = computed(() =>
    compact([createdOptionTitle.value && { label: createdOptionTitle.value, value: 'new' }, ...(delayedOptions.value || [])])
);

function setDelayedOptions() {
    delayedOptions.value = cloneDeep(options);
}

async function loadOptions() {
    await sleepSecs(2);
    return [...options];
}

function createOption(name: string) {
    createdOptionTitle.value = name;
    selectedCreateOption.value = 'new';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logModelValueChange(newValue: any) {
    console.log('Model value changed:', newValue);
}

onMounted(() => setTimeout(setDelayedOptions, 2000));
</script>

<style lang="scss" scoped>
#demo-vf-smart-select {
    > div {
        margin-top: 12px;
    }

    .vf-smart-select {
        max-width: 400px;
    }

    b {
        display: block;
    }
}
</style>
