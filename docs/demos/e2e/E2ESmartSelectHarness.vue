<template>
    <div id="demo-vf-smart-select">
        <div>
            <b>Local options + label field</b>
            <VfSmartSelect v-model="selectedOption1" :options="options" label-field="label" />
            Selected object: {{ JSON.stringify(selectedOption1) }}
        </div>

        <div>
            <b>Local options + label field + group + null title</b>
            <VfSmartSelect v-model="selectedOption2" :options="options" label-field="label" group-field="group" null-title="No selection" />
            Selected object: {{ JSON.stringify(selectedOption2) }}
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

const selectedOption1 = ref<IOption | null>(null);
const selectedOption2 = ref<IOption | null>(null);
</script>

<style scoped>
#demo-vf-smart-select > div {
    margin-top: 12px;
}

#demo-vf-smart-select .vf-smart-select {
    max-width: 400px;
}

#demo-vf-smart-select b {
    display: block;
}
</style>
