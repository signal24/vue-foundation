<template>
    <div data-testid="demo-confirm-destroy">
        <button @click="handleConfirmDestroy">Show Confirm Destroy</button>
        <span v-if="result" class="result" style="margin-left: 12px; font-size: 13px; color: var(--vp-c-text-2)">{{ result }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showConfirmDestroy } from '@signal24/vue-foundation';

const result = ref('');

async function handleConfirmDestroy() {
    const ok = await showConfirmDestroy('Destructive Action', 'This cannot be undone. Continue?');
    result.value = ok ? 'Destroyed' : 'Cancelled';
}
</script>
