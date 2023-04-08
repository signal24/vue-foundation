<template>
    <VfSmartSelect v-model="selectedItem" :options="options" :formatter="o => o.label" />
</template>

<script lang="ts" setup>
import { isEqual } from 'lodash';
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

import VfSmartSelect from './smart-select.vue';

const props = defineProps<{
    modelValue: string | null;
    nullText?: string;
    placeholder?: string;
    options: Record<string, string>;
}>();

const options = computed(() => {
    return Object.entries(props.options).map(([value, label]) => ({
        value,
        label
    }));
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
}>();

type GenericObject = { [key: string]: any };
const selectedItem = ref<GenericObject | null>(null);
watch(
    () => props.modelValue,
    value => {
        selectedItem.value = options.value.find(o => o.value === value) ?? null;
    }
);
watch(selectedItem, value => {
    emit('update:modelValue', value ? options.value.find(o => isEqual(o, value))?.value ?? null : null);
});
</script>
