<template>
    <div>
        <div style="margin-bottom: 12px">
            <label style="display: block; margin-bottom: 4px; font-weight: 600">This input auto-focuses on mount:</label>
            <input
                v-autofocus
                type="text"
                placeholder="I was focused automatically"
                style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 300px"
            />
        </div>

        <button
            style="
                padding: 6px 14px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: var(--vp-c-bg-soft);
                cursor: pointer;
                margin-bottom: 12px;
            "
            @click="showSecond = !showSecond"
        >
            {{ showSecond ? 'Hide' : 'Show' }} second input
        </button>

        <div v-if="showSecond">
            <label style="display: block; margin-bottom: 4px; font-weight: 600">This input also auto-focuses when shown:</label>
            <input
                v-autofocus
                type="text"
                placeholder="I was focused when toggled in"
                style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 300px"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showSecond = ref(false);
</script>
