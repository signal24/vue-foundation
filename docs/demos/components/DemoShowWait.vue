<template>
    <div data-testid="demo-wait">
        <button @click="handleWait">Show Wait</button>
        <span v-if="result" class="result" style="margin-left: 12px; font-size: 13px; color: var(--vp-c-text-2)">{{ result }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showWait } from '@zyno-io/vue-foundation';

const result = ref('');

async function handleWait() {
    const dismiss = showWait('Processing, please wait...');
    setTimeout(() => {
        dismiss();
        result.value = 'Wait dismissed after 2 seconds';
    }, 2000);
}
</script>
