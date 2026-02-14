<template>
    <div class="demo-container">
        <div class="demo-preview">
            <ClientOnly>
                <slot />
            </ClientOnly>
        </div>
        <div class="demo-actions">
            <button class="demo-source-toggle" @click="showSource = !showSource">
                {{ showSource ? 'Hide Source' : 'View Source' }}
            </button>
        </div>
        <div v-show="showSource" class="demo-source">
            <slot name="source" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const showSource = ref(false);
</script>

<style scoped>
.demo-container {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    margin: 16px 0;
    overflow: hidden;
}

.demo-preview {
    padding: 20px;
}

.demo-actions {
    border-top: 1px solid var(--vp-c-divider);
    padding: 8px 12px;
    background: var(--vp-c-bg-soft);
}

.demo-source-toggle {
    font-size: 13px;
    color: var(--vp-c-text-2);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
}

.demo-source-toggle:hover {
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg-mute);
}

.demo-source :deep(div[class*='language-']) {
    margin: 0;
    border-radius: 0;
}
</style>
