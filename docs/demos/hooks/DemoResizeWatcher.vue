<template>
    <div>
        <div style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 20px; max-width: 400px; text-align: center">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--vp-c-text-2)">Window dimensions (resize to update):</p>
            <p style="margin: 0; font-size: 24px; font-weight: 600">{{ width }} x {{ height }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useResizeWatcher } from '@signal24/vue-foundation';

const width = ref(0);
const height = ref(0);

function updateDimensions() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
}

onMounted(updateDimensions);
useResizeWatcher(updateDimensions);
</script>
