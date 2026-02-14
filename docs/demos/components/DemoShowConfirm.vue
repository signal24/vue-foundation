<template>
    <div>
        <button @click="handleConfirm">Show Confirm</button>
        <span v-if="result" style="margin-left: 12px; font-size: 13px; color: var(--vp-c-text-2)">{{ result }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showConfirm } from '@signal24/vue-foundation';

const result = ref('');

async function handleConfirm() {
    const ok = await showConfirm('Confirm Action', 'Do you want to proceed?');
    result.value = ok ? 'Confirmed' : 'Cancelled';
}
</script>
