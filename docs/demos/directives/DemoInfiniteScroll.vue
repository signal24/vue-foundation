<template>
    <div>
        <div
            v-infinite-scroll="loadMore"
            style="overflow: auto; height: 200px; border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 8px"
        >
            <div v-for="item in items" :key="item" style="padding: 8px 12px; border-bottom: 1px solid var(--vp-c-divider)">Item {{ item }}</div>
            <div v-if="loading" style="padding: 8px 12px; color: var(--vp-c-text-2); text-align: center">Loading more...</div>
        </div>
        <p style="margin-top: 8px; color: var(--vp-c-text-2)">Showing {{ items.length }} items. Scroll down to load more.</p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const items = ref<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
const loading = ref(false);
let nextId = 21;

function loadMore() {
    if (loading.value) return;
    loading.value = true;
    setTimeout(() => {
        const newItems = Array.from({ length: 10 }, () => nextId++);
        items.value.push(...newItems);
        loading.value = false;
    }, 500);
}
</script>
