<template>
    <div>
        <p style="margin-bottom: 12px">
            Press
            <kbd style="padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px; background: var(--vp-c-bg-soft); font-size: 0.9em">s</kbd> or
            <kbd style="padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px; background: var(--vp-c-bg-soft); font-size: 0.9em">Escape</kbd>
            to trigger the buttons below.
        </p>

        <div style="display: flex; gap: 12px; margin-bottom: 12px">
            <button
                v-hotkey="'s'"
                style="padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px; background: var(--vp-c-bg-soft); cursor: pointer"
                @click="saveCount++"
            >
                Save [S]
            </button>

            <button
                v-hotkey="'Escape'"
                style="padding: 6px 14px; border: 1px solid #ccc; border-radius: 4px; background: var(--vp-c-bg-soft); cursor: pointer"
                @click="escapeCount++"
            >
                Cancel [Esc]
            </button>
        </div>

        <p>
            Save triggered: <strong>{{ saveCount }}</strong> times
        </p>
        <p>
            Cancel triggered: <strong>{{ escapeCount }}</strong> times
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const saveCount = ref(0);
const escapeCount = ref(0);
</script>
