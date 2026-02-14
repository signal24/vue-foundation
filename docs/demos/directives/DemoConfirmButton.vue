<template>
    <div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px">
            <button
                v-confirm-button
                style="padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px; background: var(--vp-c-bg-soft); cursor: pointer"
                @confirm="defaultCount++"
            >
                Delete (default)
            </button>

            <button
                v-confirm-button="{ text: 'Really delete?', class: 'confirming' }"
                style="padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px; background: var(--vp-c-bg-soft); cursor: pointer"
                @confirm="customCount++"
            >
                Delete (custom text)
            </button>
        </div>

        <p>
            Default confirmed: <strong>{{ defaultCount }}</strong> times
        </p>
        <p>
            Custom confirmed: <strong>{{ customCount }}</strong> times
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const defaultCount = ref(0);
const customCount = ref(0);
</script>

<style scoped>
:deep(.confirming) {
    background: #fee2e2 !important;
    border-color: #f87171 !important;
    color: #b91c1c !important;
}
</style>
