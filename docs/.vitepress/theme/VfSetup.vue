<template>
    <DefaultLayout />
    <ClientOnly>
        <OverlayContainer />
    </ClientOnly>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import { OverlayContainer } from '@signal24/vue-foundation';

const DefaultLayout = DefaultTheme.Layout;
</script>
