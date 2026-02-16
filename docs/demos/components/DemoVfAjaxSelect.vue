<template>
    <div style="max-width: 320px">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Async loading select</label>
        <VfAjaxSelect v-model="selectedItem" :load-fn="loadItems" display-key="name" null-text="Select a color..." loading-text="Loading colors..." />
        <p style="margin-top: 8px; font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ selectedItem ? selectedItem.name : 'none' }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfAjaxSelect } from '@zyno-io/vue-foundation';

interface IColor {
    id: number;
    name: string;
}

const selectedItem = ref<IColor | null>(null);

async function loadItems(): Promise<IColor[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { id: 1, name: 'Red' },
        { id: 2, name: 'Green' },
        { id: 3, name: 'Blue' },
        { id: 4, name: 'Yellow' },
        { id: 5, name: 'Purple' }
    ];
}
</script>
