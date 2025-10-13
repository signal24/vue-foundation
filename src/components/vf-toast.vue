<template>
    <div class="vf-toast" :class="[className, { top: position === 'top', bottom: position !== 'top' }]" @click.stop="handleClick">
        <div class="content">
            <div class="message">{{ message }}</div>
            <div v-if="!disableClose" class="close">x</div>
        </div>
        <div v-if="durationSecs !== null" class="progress-bar">
            <div ref="progressInnerEl" class="inner"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

export interface IToastOptions {
    position?: 'top' | 'bottom';
    message: string;
    className?: string;
    durationSecs?: number | null;
    disableClose?: boolean;
    onClick?: () => void;
}

const props = defineProps<
    IToastOptions & {
        callback: () => void;
    }
>();

function handleClick() {
    if (props.onClick) {
        props.onClick();
        props.callback();
    } else if (!props.disableClose) {
        props.callback();
    }
}

const progressInnerEl = ref<HTMLElement>();
if (props.durationSecs !== null) {
    onMounted(() => {
        const durationSecs = props.durationSecs ?? 5;
        progressInnerEl.value?.animate([{ width: '0%' }, { width: '100%' }], {
            duration: durationSecs * 1000,
            easing: 'linear'
        });
        setTimeout(() => props.callback(), durationSecs * 1000);
    });
}
</script>

<style lang="scss">
.vf-toast {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.vf-toast.bottom {
    bottom: 50px;
}

.vf-toast.top {
    top: 50px;
}

.vf-toast .content {
    display: flex;
    align-items: center;
}
</style>
