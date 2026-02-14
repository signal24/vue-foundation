<template>
    <div>
        <div style="margin-bottom: 12px">
            <label style="cursor: pointer">
                <input v-model="isReadonly" type="checkbox" />
                Toggle readonly state
            </label>
        </div>

        <div>
            <label style="display: block; margin-bottom: 4px; font-weight: 600">Input with v-readonly:</label>
            <input
                v-readonly="isReadonly"
                type="text"
                value="Try toggling the checkbox above"
                style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 300px"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isReadonly = ref(true);
</script>
