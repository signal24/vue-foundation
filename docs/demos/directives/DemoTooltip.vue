<template>
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
        <button
            v-tooltip="'Click to save'"
            style="padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px; background: var(--vp-c-bg-soft); cursor: pointer"
        >
            Hover me (string binding)
        </button>

        <span
            v-tooltip
            tip="Help text"
            style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--vp-c-bg-soft);
                border: 1px solid #ccc;
                cursor: help;
                font-weight: 600;
            "
        >
            ?
        </span>

        <button
            v-tooltip="isActive ? 'Status: Active' : null"
            style="padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px; background: var(--vp-c-bg-soft); cursor: pointer"
            @click="isActive = !isActive"
        >
            {{ isActive ? 'Active (has tooltip)' : 'Inactive (no tooltip)' }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isActive = ref(true);
</script>
