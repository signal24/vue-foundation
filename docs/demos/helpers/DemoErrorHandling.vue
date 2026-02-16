<template>
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 500px">
        <div>
            <button @click="triggerUserError">Trigger UserError</button>
            <p v-if="userErrorOutput" style="margin-top: 8px; white-space: pre-wrap; color: var(--vp-c-text-2)">
                {{ userErrorOutput }}
            </p>
        </div>
        <div>
            <button @click="triggerSystemError">Trigger System Error</button>
            <p v-if="systemErrorOutput" style="margin-top: 8px; white-space: pre-wrap; color: var(--vp-c-text-2)">
                {{ systemErrorOutput }}
            </p>
        </div>
        <div>
            <button @click="triggerAlertUserError">handleErrorAndAlert (UserError)</button>
        </div>
        <div>
            <button @click="triggerAlertSystemError">handleErrorAndAlert (System)</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { UserError, formatError, handleErrorAndAlert } from '@zyno-io/vue-foundation';

const userErrorOutput = ref('');
const systemErrorOutput = ref('');

function triggerUserError() {
    const err = new UserError('Please enter a valid email address');
    userErrorOutput.value = formatError(err);
}

function triggerSystemError() {
    const err = new Error('ECONNREFUSED');
    systemErrorOutput.value = formatError(err);
}

async function triggerAlertUserError() {
    await handleErrorAndAlert(new UserError('This is a user-facing error message'));
}

async function triggerAlertSystemError() {
    await handleErrorAndAlert(new Error('Connection timeout'), {
        title: 'Operation Failed'
    });
}
</script>
