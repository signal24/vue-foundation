<template>
    <div>
        <div style="margin-bottom: 12px">
            <label style="display: block; margin-bottom: 4px; font-weight: 600">Type a date and blur to normalize:</label>
            <input
                v-date-input
                v-model="dateValue"
                type="text"
                placeholder="e.g. 1/15 or 01/15/2024"
                style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 300px"
            />
        </div>

        <p>
            Normalized value: <code>{{ dateValue || '(empty)' }}</code>
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const dateValue = ref('');
</script>
