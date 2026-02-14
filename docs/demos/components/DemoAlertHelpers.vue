<template>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start">
        <button @click="handleAlert">showAlert</button>
        <button @click="handleConfirm">showConfirm</button>
        <button @click="handleConfirmDestroy">showConfirmDestroy</button>
        <button @click="handleWait">showWait</button>
        <button @click="handleMutableWait">showMutableWait</button>
    </div>
    <p v-if="result" style="margin-top: 12px; font-size: 14px; color: var(--vp-c-text-2)">
        Result: <strong>{{ result }}</strong>
    </p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showAlert, showConfirm, showConfirmDestroy, showWait, showMutableWait } from '@signal24/vue-foundation';

const result = ref('');

async function handleAlert() {
    await showAlert('Hello!', 'This is an alert dialog.');
    result.value = 'Alert dismissed';
}

async function handleConfirm() {
    const ok = await showConfirm('Confirm Action', 'Do you want to proceed?');
    result.value = ok ? 'Confirmed' : 'Cancelled';
}

async function handleConfirmDestroy() {
    const ok = await showConfirmDestroy('Destructive Action', 'This cannot be undone. Continue?');
    result.value = ok ? 'Destroyed' : 'Cancelled';
}

async function handleWait() {
    const dismiss = showWait('Processing, please wait...');
    setTimeout(() => {
        dismiss();
        result.value = 'Wait dismissed after 2 seconds';
    }, 2000);
}

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
