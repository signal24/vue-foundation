<template>
    <div id="demo-vf-alert-modal">
        <button @click="showAlertDemo">Show Alert Modal</button>
        <button @click="showConfirmDemo">Show Confirm Modal</button>
        <button @click="showConfirmDestroyDemo">Show Confirm Destroy Modal</button>
        <button @click="showWaitDemo">Show Wait Modal</button>
        <button @click="showMutableWaitDemo">Show Mutable Wait Modal</button>
        <button @click="showToastDemo">Show Toast</button>
        <button @click="showStackedDemo">Show Stacked Overlays</button>
        <p id="last-result"></p>
    </div>
</template>

<script lang="ts" setup>
import { showAlert, showConfirm, showConfirmDestroy, showMutableWait, showToast, showWait } from '@signal24/vue-foundation';

function setResult(text: string) {
    document.getElementById('last-result')!.textContent = text;
}

async function showAlertDemo() {
    await showAlert({
        title: 'Alert Modal',
        message: 'This is a simple alert modal.'
    });
    setResult('Alert closed');
}

async function showConfirmDemo() {
    const result = await showConfirm({
        title: 'Confirm Action',
        message: 'Are you sure you want to continue?'
    });
    setResult(`Confirm result: ${result}`);
}

async function showConfirmDestroyDemo() {
    const result = await showConfirmDestroy({
        title: 'Delete Item',
        message: 'This action cannot be undone.'
    });
    setResult(`Destroy result: ${result}`);
}

async function showWaitDemo() {
    const dismiss = showWait('Wait Demo', 'Waiting 1 second...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    dismiss();
}

async function showMutableWaitDemo() {
    const wait = showMutableWait({
        message: 'Waiting 1 second...'
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    wait.update('Another second...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    wait.dismiss();
}

function showToastDemo() {
    showToast({
        message: 'Saved successfully!',
        durationSecs: 3
    });
}

async function showStackedDemo() {
    await showAlert({
        title: 'First Overlay',
        message: 'Click OK to open a second overlay.'
    });
    await showAlert({
        title: 'Second Overlay',
        message: 'This appeared after the first was closed.'
    });
    setResult('Stacked closed');
}
</script>
