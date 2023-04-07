<template>
    <select v-if="!renderOptions" disabled>
        <option>{{ props.loadingText || 'Loading...' }}</option>
    </select>
    <select v-else v-model="selectedItem">
        <option v-if="props.nullText" :value="null">{{ props.nullText }}</option>
        <option v-for="(renderOption, index) in renderOptions" :key="index" :value="options?.[index]">
            {{ renderOption }}
        </option>
    </select>
</template>

<script lang="ts">
import { computed, defineComponent, defineEmits, defineProps, ref } from 'vue';

// todo: make type safe when Vue alpha is released

type GenericObject = { [key: string]: any };

export default defineComponent({
    setup() {
        const props = defineProps<{
            modelValue: any;
            loadFn: () => Promise<GenericObject[]>;
            nullText?: string;
            loadingText?: string;
            displayKey?: string;
            preprocesor?: (option: GenericObject) => string;
        }>();

        defineEmits(['update:modelValue']);

        const options = ref<GenericObject[] | null>(null);
        const renderOptions = computed(() => {
            if (!options.value) {
                return null;
            }

            const result = options.value.map(option => {
                return props.preprocesor ? props.preprocesor(option) : option[props.displayKey ?? ''];
            });

            return result;
        });

        const selectedItem = ref<GenericObject | null>(props.modelValue ?? null);

        return { props, options, renderOptions, selectedItem };
    },

    watch: {
        loadFn() {
            this.load();
        },

        selectedItem() {
            this.$emit('update:modelValue', this.selectedItem);
        },

        modelValue() {
            this.selectedItem = this.props.modelValue;
        }
    },

    mounted() {
        this.load();
    },

    methods: {
        async load() {
            this.options = await this.props.loadFn();
        }
    }
});
</script>
