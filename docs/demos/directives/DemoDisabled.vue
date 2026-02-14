<template>
    <div>
        <div style="margin-bottom: 12px">
            <label style="cursor: pointer">
                <input v-model="isDisabled" type="checkbox" />
                Toggle disabled state
            </label>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px">
            <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 600">Input with v-disabled:</label>
                <input
                    v-disabled="isDisabled"
                    type="text"
                    value="Try toggling the checkbox above"
                    style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 300px"
                />
            </div>

            <div>
                <label v-disabled="isDisabled" style="cursor: pointer">
                    <input type="checkbox" />
                    Label with child input (both disabled together)
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isDisabled = ref(false);
</script>
