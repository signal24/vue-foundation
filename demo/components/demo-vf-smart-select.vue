<template>
    <div id="demo-vf-smart-select">
        <div>
            <VfSmartSelect v-model="selectedOption" :options="options" label-field="label" />

            Selected value: {{ selectedOption?.label ?? '-' }}
        </div>

        <div>
            <VfSmartSelect v-model="selectedOption" :options="options" label-field="label" group-field="group" null-title="No selection" />

            Selected value: {{ selectedOption?.label ?? '-' }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import VfSmartSelect from '@/components/vf-smart-select.vue';

const options = [
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

const selectedOption = ref<(typeof options)[number] | null>(null);
</script>

<style lang="scss" scoped>
#demo-vf-smart-select {
    max-width: 450px;

    > div {
        margin-top: 12px;
    }
}
</style>
