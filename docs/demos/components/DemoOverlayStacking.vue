<template>
    <div data-testid="demo-stacking">
        <button @click="handleStacking">Show Stacked Overlays</button>
        <span v-if="result" class="result" style="margin-left: 12px; font-size: 13px; color: var(--vp-c-text-2)">{{ result }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showAlert } from '@signal24/vue-foundation';

const result = ref('');

async function handleStacking() {
    await showAlert('First Overlay', 'Click OK to open a second overlay.');
    await showAlert('Second Overlay', 'This appeared after the first was closed.');
    result.value = 'Stacked overlays completed';
}
</script>
