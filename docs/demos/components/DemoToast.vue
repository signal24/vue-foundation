<template>
    <div data-testid="demo-toast" style="display: flex; flex-wrap: wrap; gap: 8px">
        <button data-testid="toast-bottom" @click="showBottomToast">Toast (bottom)</button>
        <button data-testid="toast-top" @click="showTopToast">Toast (top)</button>
        <button data-testid="toast-persistent" @click="showPersistentToast">Persistent toast</button>
        <button data-testid="toast-clickable" @click="showClickableToast">Clickable toast</button>
    </div>
</template>

<script lang="ts" setup>
import { showToast, showAlert } from '@zyno-io/vue-foundation';

function showBottomToast() {
    showToast({
        message: 'Item saved successfully!',
        position: 'bottom',
        durationSecs: 3
    });
}

function showTopToast() {
    showToast({
        message: 'New notification received',
        position: 'top',
        durationSecs: 3
    });
}

function showPersistentToast() {
    const dismiss = showToast({
        message: 'This toast stays until you close it',
        durationSecs: null
    });
    // Could call dismiss() programmatically later
}

async function showClickableToast() {
    showToast({
        message: 'Click me for details!',
        durationSecs: 5,
        onClick: () => {
            showAlert('You clicked the toast!');
        }
    });
}
</script>
