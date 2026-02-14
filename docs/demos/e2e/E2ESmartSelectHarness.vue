<template>
    <div id="demo-vf-smart-select">
        <!-- 1. Basic: label-field + value-field -->
        <section data-testid="basic">
            <b>Basic (label-field + value-field)</b>
            <VfSmartSelect v-model="basicValue" :options="fruitOptions" label-field="label" value-field="value" placeholder="Pick a fruit..." />
            <span class="result">{{ basicValue ?? 'none' }}</span>
        </section>

        <!-- 2. Grouped + null-title -->
        <section data-testid="grouped">
            <b>Grouped + null-title</b>
            <VfSmartSelect
                v-model="groupedValue"
                :options="groupedOptions"
                label-field="label"
                value-field="value"
                group-field="group"
                null-title="Clear selection"
            />
            <span class="result">{{ groupedValue ?? 'none' }}</span>
        </section>

        <!-- 3. Full object value (no value-field) -->
        <section data-testid="object">
            <b>Object value (no value-field)</b>
            <VfSmartSelect v-model="objectValue" :options="fruitOptions" label-field="label" placeholder="Select..." />
            <span class="result">{{ objectValue ? objectValue.label : 'none' }}</span>
        </section>

        <!-- 4. Custom formatter + value-extractor -->
        <section data-testid="formatter">
            <b>Formatter + value-extractor</b>
            <VfSmartSelect
                v-model="formatterValue"
                :options="groupedOptions"
                :formatter="(o: IOption) => `${o.label} (${o.group})`"
                :value-extractor="(o: IOption) => o.value"
                placeholder="Select..."
            />
            <span class="result">{{ formatterValue ?? 'none' }}</span>
        </section>

        <!-- 5. Preselected value -->
        <section data-testid="preselected">
            <b>Preselected value</b>
            <VfSmartSelect v-model="preselectedValue" :options="fruitOptions" label-field="label" value-field="value" />
            <span class="result">{{ preselectedValue }}</span>
        </section>

        <!-- 6. Delayed options (loading state) -->
        <section data-testid="delayed">
            <b>Delayed options</b>
            <VfSmartSelect
                v-model="delayedValue"
                :options="delayedOptions"
                label-field="label"
                value-field="value"
                loading-text="Loading options..."
                null-title="No selection"
            />
            <span class="result">{{ delayedValue ?? 'none' }}</span>
        </section>

        <!-- 7. Async with preload -->
        <section data-testid="async-preload">
            <b>Async (preload)</b>
            <VfSmartSelect
                v-model="asyncPreloadValue"
                :load-options="loadOptions"
                label-field="label"
                value-field="value"
                preload
                loading-text="Fetching..."
            />
            <span class="result">{{ asyncPreloadValue ?? 'none' }}</span>
        </section>

        <!-- 8. Async lazy (no preload) -->
        <section data-testid="async-lazy">
            <b>Async (lazy)</b>
            <VfSmartSelect
                v-model="asyncLazyValue"
                :load-options="loadOptions"
                label-field="label"
                value-field="value"
                placeholder="Click to load..."
            />
            <span class="result">{{ asyncLazyValue ?? 'none' }}</span>
        </section>

        <!-- 9. Create item -->
        <section data-testid="create">
            <b>Create item</b>
            <VfSmartSelect
                v-model="createValue"
                :options="createOptions"
                :formatter="(o: IOption) => o.label"
                :value-extractor="(o: IOption) => o.value"
                :on-create-item="handleCreate"
                placeholder="Search or create..."
            />
            <span class="result">{{ createValue ?? 'none' }}</span>
        </section>

        <!-- 10. Disabled -->
        <section data-testid="disabled">
            <b>Disabled</b>
            <VfSmartSelect v-model="disabledValue" :options="fruitOptions" label-field="label" value-field="value" disabled />
            <span class="result">{{ disabledValue }}</span>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { VfSmartSelect } from '@signal24/vue-foundation';

interface IOption {
    label: string;
    value: string;
    group?: string;
}

const fruitOptions: IOption[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' }
];

const groupedOptions: IOption[] = [
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

// 1. Basic
const basicValue = ref<string | null>(null);

// 2. Grouped
const groupedValue = ref<string | null>(null);

// 3. Object value
const objectValue = ref<IOption | null>(null);

// 4. Formatter
const formatterValue = ref<string | null>(null);

// 5. Preselected
const preselectedValue = ref<string | null>('2');

// 6. Delayed
const delayedOptions = ref<IOption[]>();
const delayedValue = ref<string | null>(null);

onMounted(() => {
    setTimeout(() => {
        delayedOptions.value = [...fruitOptions];
    }, 1500);
});

// 7 & 8. Async
const asyncPreloadValue = ref<string | null>(null);
const asyncLazyValue = ref<string | null>(null);

async function loadOptions(): Promise<IOption[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { value: 'a', label: 'Async Option A' },
        { value: 'b', label: 'Async Option B' },
        { value: 'c', label: 'Async Option C' }
    ];
}

// 9. Create
const createValue = ref<string | null>(null);
const createdLabel = ref<string>();
const createOptions = computed<IOption[]>(() => {
    if (createdLabel.value) {
        return [{ value: 'new', label: createdLabel.value }, ...fruitOptions];
    }
    return fruitOptions;
});

function handleCreate(text: string) {
    createdLabel.value = text;
    createValue.value = 'new';
}

// 10. Disabled
const disabledValue = ref<string | null>('2');
</script>

<style scoped>
#demo-vf-smart-select section {
    margin-top: 12px;
}

#demo-vf-smart-select .vf-smart-select {
    max-width: 400px;
}

#demo-vf-smart-select b {
    display: block;
}

#demo-vf-smart-select .result {
    display: block;
    font-size: 13px;
    margin-top: 4px;
}
</style>
