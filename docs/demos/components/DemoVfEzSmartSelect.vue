<template>
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 320px">
        <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">String array options</label>
            <VfEzSmartSelect
                v-model="statusValue"
                :options="['active', 'inactive', 'pending']"
                null-title="All statuses"
                placeholder="Filter by status..."
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ statusValue ?? 'none' }}</span>
        </div>

        <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600">Key-value object options</label>
            <VfEzSmartSelect
                v-model="roleValue"
                :options="{ admin: 'Administrator', user: 'Regular User', guest: 'Guest' }"
                placeholder="Select role..."
            />
            <span style="font-size: 13px; color: var(--vp-c-text-2)">Selected: {{ roleValue ?? 'none' }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfEzSmartSelect } from '@zyno-io/vue-foundation';

const statusValue = ref<string | null>(null);
const roleValue = ref<string | null>(null);
</script>
