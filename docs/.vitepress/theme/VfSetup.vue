<template>
    <DefaultLayout />
    <ClientOnly>
        <OverlayContainer />
    </ClientOnly>
</template>

<script setup>
import { OverlayContainer } from '@zyno-io/vue-foundation';
import DefaultTheme from 'vitepress/theme';

const DefaultLayout = DefaultTheme.Layout;
</script>
