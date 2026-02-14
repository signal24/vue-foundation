<template>
    <div>
        <button @click="openOverlay">Present Overlay</button>
        <p v-if="overlayResult" style="margin-top: 12px; font-size: 14px; color: var(--vp-c-text-2)">
            Overlay result: <strong>{{ overlayResult }}</strong>
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, h } from 'vue';
import { presentOverlay, VfModal } from '@signal24/vue-foundation';

const overlayResult = ref('');

const SimpleOverlay = defineComponent({
    props: {
        callback: { type: Function, required: true }
    },
    setup(props) {
        return () =>
            h(
                VfModal,
                { closeOnMaskClick: true },
                {
                    header: () => 'Overlay Example',
                    default: () => h('p', 'This component was shown using presentOverlay(). Click a button or the backdrop to close.'),
                    footer: () => [
                        h('button', { type: 'button', onClick: () => props.callback('cancelled') }, 'Cancel'),
                        h('button', { onClick: () => props.callback('confirmed') }, 'Confirm')
                    ]
                }
            );
    }
});

async function openOverlay() {
    const result = await presentOverlay(SimpleOverlay, {});
    overlayResult.value = String(result);
}
</script>
