<template>
    <div>
        <button @click="handleMutableWait">Show Mutable Wait</button>
        <span v-if="result" style="margin-left: 12px; font-size: 13px; color: var(--vp-c-text-2)">{{ result }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showMutableWait } from '@signal24/vue-foundation';

const result = ref('');

async function handleMutableWait() {
    const wait = showMutableWait('Starting...');
    result.value = 'Running mutable wait...';

    setTimeout(() => wait.update('Step 1 of 3...'), 800);
    setTimeout(() => wait.update('Step 2 of 3...'), 1600);
    setTimeout(() => wait.update('Step 3 of 3...'), 2400);
    setTimeout(() => {
        wait.dismiss();
        result.value = 'Mutable wait completed';
    }, 3200);
}
</script>
