<template>
    <DefaultLayout />
    <ClientOnly>
        <OverlayContainer />
    </ClientOnly>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import { OverlayContainer } from '@zyno-io/vue-foundation';

const DefaultLayout = DefaultTheme.Layout;
</script>
