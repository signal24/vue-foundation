<template>
    <div id="vf-demo">
        <select v-model="selectedDemo">
            <option :value="null" disabled selected>Select a demo</option>
            <option v-for="demo in demos" :key="demo" :value="demo">{{ demo }}</option>
        </select>

        <DemoVfSmartSelect v-if="selectedDemo === 'VfSmartSelect'" />
        <DemoVfAlertModal v-else-if="selectedDemo === 'VfAlertModal'" />

        <OverlayContainer />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { OverlayContainer } from '@/components';

import DemoVfAlertModal from './demo-vf-alert-modal.vue';
import DemoVfSmartSelect from './demo-vf-smart-select.vue';

const demos = ['VfSmartSelect', 'VfAlertModal'] as const;
const selectedDemo = ref<(typeof demos)[number] | null>();
</script>

<style lang="scss" scoped></style>
