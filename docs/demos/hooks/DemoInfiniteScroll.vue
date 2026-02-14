<template>
    <div style="overflow: auto; height: 250px; border: 1px solid var(--vp-c-divider); border-radius: 8px; max-width: 400px">
        <div v-for="item in items" :key="item" style="padding: 10px 16px; border-bottom: 1px solid var(--vp-c-divider)">Item {{ item }}</div>
        <div v-if="loading" style="padding: 10px 16px; color: var(--vp-c-text-2); text-align: center">Loading more...</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useInfiniteScroll } from '@signal24/vue-foundation';

const items = ref<number[]>([]);
const loading = ref(false);
let nextItem = 1;

async function loadMore() {
    if (loading.value) return;
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 0; i < 20; i++) {
        items.value.push(nextItem++);
    }
    loading.value = false;
}

useInfiniteScroll({
    elScrolledToBottom: loadMore
});

loadMore();
</script>
