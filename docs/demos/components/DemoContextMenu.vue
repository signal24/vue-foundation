<template>
    <div>
        <div
            style="
                border: 1px dashed var(--vp-c-divider);
                border-radius: 8px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                user-select: none;
                cursor: context-menu;
            "
            @contextmenu="onContextMenu"
        >
            Right-click here to open the context menu
        </div>
        <p v-if="lastAction" style="margin-top: 12px; color: var(--vp-c-text-2)">Last action: {{ lastAction }}</p>
    </div>
</template>

<script lang="ts" setup>
import { showContextMenu } from '@zyno-io/vue-foundation';
import { ref } from 'vue';

const lastAction = ref('');

function onContextMenu(e: MouseEvent) {
    e.preventDefault();
    showContextMenu(e, {
        items: [
            { title: 'Edit', handler: () => (lastAction.value = 'Edit clicked') },
            { title: 'Duplicate', handler: () => (lastAction.value = 'Duplicate clicked') },
            {
                title: 'Move to',
                items: [
                    { title: 'Inbox', handler: () => (lastAction.value = 'Moved to Inbox') },
                    { title: 'Archive', handler: () => (lastAction.value = 'Moved to Archive') },
                    {
                        title: 'More…',
                        items: [
                            { title: 'Spam', handler: () => (lastAction.value = 'Moved to Spam') },
                            { title: 'Trash', handler: () => (lastAction.value = 'Moved to Trash') }
                        ]
                    }
                ]
            },
            '-',
            {
                title: 'Delete',
                handler: () => (lastAction.value = 'Delete confirmed'),
                class: 'danger',
                shouldConfirm: true
            }
        ]
    });
}
</script>
