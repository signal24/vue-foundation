<template>
    <div data-testid="demo-alert">
        <button @click="handleAlert">Show Alert</button>
        <span v-if="result" class="result" style="margin-left: 12px; font-size: 13px; color: var(--vp-c-text-2)">{{ result }}</span>
    </div>
</template>

<script lang="ts" setup>
import { showAlert } from '@zyno-io/vue-foundation';
import { ref } from 'vue';

const result = ref('');

async function handleAlert() {
    await showAlert('Hello!', 'This is an alert dialog.');
    result.value = 'Alert dismissed';
}
</script>
