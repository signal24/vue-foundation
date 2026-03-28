<template>
    <div data-testid="demo-ss-async" style="display: flex; flex-direction: column; gap: 16px; max-width: 320px">
        <div data-testid="async-preload">
            <span style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">With preload</span>
            <VfSmartSelect
                v-model="preloadValue"
                :load-options="loadOptions"
                :label-field="'label'"
                :value-field="'value'"
                preload
                loading-text="Fetching..."
            />
            <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ preloadValue ?? 'none' }}</span>
        </div>

        <div data-testid="async-lazy">
            <span style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Lazy (no preload)</span>
            <VfSmartSelect
                v-model="lazyValue"
                :load-options="loadOptions"
                :label-field="'label'"
                :value-field="'value'"
                placeholder="Click to load..."
            />
            <span class="result" style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ lazyValue ?? 'none' }} (loads on first open)</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { VfSmartSelect } from '@zyno-io/vue-foundation';
import { ref } from 'vue';

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
