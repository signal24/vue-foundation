<template>
    <div>
        <button @click="showModal = true">Open Modal</button>

        <teleport to="body">
            <VfModal v-if="showModal" close-on-mask-click close-x @close="showModal = false">
                <template #header>Example Modal</template>

                <p>This is a modal with <code>close-on-mask-click</code> and <code>close-x</code> enabled.</p>
                <p>Click the backdrop, the X button, or press Escape to close it.</p>

                <template #footer>
                    <button type="button" @click="showModal = false">Cancel</button>
                    <button @click="handleSave">Save</button>
                </template>
            </VfModal>
        </teleport>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VfModal, showAlert } from '@signal24/vue-foundation';

const showModal = ref(false);

async function handleSave() {
    showModal.value = false;
    await showAlert('Saved!');
}
</script>
