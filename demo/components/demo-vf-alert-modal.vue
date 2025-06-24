<template>
    <div id="demo-vf-alert-modal">
        <button @click="showAlertDemo">Show Alert Modal</button>
        <button @click="showWaitDemo">Show Wait Modal</button>
        <button @click="showMutableWaitDemo">Show Mutable Wait Modal</button>
    </div>
</template>

<script lang="ts" setup>
import { showAlert, showMutableWait, showWait } from '@/components';
import { sleepSecs } from '@/helpers';

async function showAlertDemo() {
    await showAlert({
        title: 'Alert Modal',
        message: 'This is a simple alert modal.'
    });
    console.log('Alert modal closed');
}

async function showWaitDemo() {
    const dismiss = showWait('Wait Demo', 'Waiting 1 second...');
    await sleepSecs(1);
    dismiss();
}

async function showMutableWaitDemo() {
    const wait = showMutableWait({
        message: 'Waiting 1 second...'
    });
    await sleepSecs(1);
    wait.update('Another second...');
    await sleepSecs(1);
    wait.dismiss();
}
</script>
