<template>
    <div>
        <div ref="maskTarget" style="position: relative; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 20px; max-width: 400px">
            <p style="margin: 0 0 12px 0">This area will be masked for 2 seconds when you click the button below.</p>
            <input type="text" placeholder="Try typing here..." style="width: 100%; padding: 6px 8px; margin-bottom: 8px" />
            <button @click="doMask">Mask This Area</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { maskEl, sleep } from '@zyno-io/vue-foundation';
import { ref } from 'vue';

const maskTarget = ref<HTMLElement>();

async function doMask() {
    if (!maskTarget.value) return;
    const unmask = maskEl(maskTarget.value, 'Loading...');
    await sleep(2000);
    unmask();
}
</script>
