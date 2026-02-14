<template>
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px">
        <div>
            <span style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">With preload</span>
            <VfSmartSelect
                v-model="preloadValue"
                :load-options="loadOptions"
                :label-field="'label'"
                :value-field="'value'"
                preload
                loading-text="Fetching..."
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ preloadValue ?? 'none' }}</span>
        </div>

        <div>
            <span style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Lazy (no preload)</span>
            <VfSmartSelect
                v-model="lazyValue"
                :load-options="loadOptions"
                :label-field="'label'"
                :value-field="'value'"
                placeholder="Click to load..."
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ lazyValue ?? 'none' }} (loads on first open)</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfSmartSelect } from '@signal24/vue-foundation';

interface IOption {
    label: string;
    value: string;
}

const preloadValue = ref<string | null>(null);
const lazyValue = ref<string | null>(null);

async function loadOptions(): Promise<IOption[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { value: 'a', label: 'Async Option A' },
        { value: 'b', label: 'Async Option B' },
        { value: 'c', label: 'Async Option C' }
    ];
}
</script>
