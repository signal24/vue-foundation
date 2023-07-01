<template>
    <div class="vf-overlay-anchor" :class="anchorClasses" :style="anchorStyles" @click.stop="removeOverlay">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

import { dismissOverlayInjectionById } from '.';
import type { OverlayAnchorOptions, OverlayAnchorOptionsObject } from './overlay-types';

const props = defineProps<{
    overlayId: string;
    anchor: OverlayAnchorOptions;
}>();

const anchorEl = props.anchor instanceof HTMLElement ? props.anchor : props.anchor.el;

const anchorStyles = ref<CSSProperties>({ visibility: 'hidden', top: '0', left: '0' });
const anchorClasses = ref<string[]>([]);
const instance = getCurrentInstance();

onMounted(updateAttributes);

function updateAttributes() {
    const overlayEl = instance!.vnode.el as HTMLElement;
    const { styles, classes } = computeAnchoredStyle(overlayEl, anchorEl);
    anchorStyles.value = styles;
    anchorClasses.value = classes;
}

function computeAnchoredStyle(
    overlayEl: HTMLElement,
    anchorEl: HTMLElement
): {
    styles: CSSProperties;
    classes: string[];
} {
    const anchorOpts: Omit<OverlayAnchorOptionsObject, 'el'> = props.anchor instanceof HTMLElement ? {} : props.anchor;

    const anchorRect = anchorEl.getBoundingClientRect();
    const overlayRect = overlayEl.getBoundingClientRect();

    if (anchorOpts.matchWidth) {
        overlayRect.width = anchorRect.width;
    }
    if (anchorOpts.matchHeight) {
        overlayRect.height = anchorRect.height;
    }

    const classes: string[] = anchorOpts.class ? (Array.isArray(anchorOpts.class) ? anchorOpts.class : [anchorOpts.class]) : [];
    let top: number, left: number;

    if (anchorOpts.y === 'center') {
        top = anchorRect.top + anchorRect.height / 2 - overlayRect.height / 2;
        classes.push('anchored-center-y');
    } else {
        const canDisplayBelow = anchorRect.bottom + overlayRect.height < window.innerHeight || anchorOpts.y === 'below';
        const canDisplayBelowResolved = canDisplayBelow && anchorOpts.y !== 'above';
        top = canDisplayBelowResolved ? anchorRect.bottom : anchorRect.top - overlayRect.height;
        classes.push(canDisplayBelowResolved ? 'anchored-top' : 'anchored-bottom');
    }

    if (anchorOpts.x === 'center') {
        left = anchorRect.left + anchorRect.width / 2 - overlayRect.width / 2;
        classes.push('anchored-center-x');
    } else {
        const canAlignLefts = anchorRect.left + overlayRect.width < window.innerWidth || anchorOpts.x === 'left';
        const canAlignLeftsResolved = canAlignLefts && anchorOpts.x !== 'right';
        left = canAlignLeftsResolved ? anchorRect.left : anchorRect.right - overlayRect.width;
        classes.push(canAlignLeftsResolved ? 'anchored-left' : 'anchored-right');
    }

    return {
        styles: {
            top: `${top}px`,
            left: `${left}px`,
            ...(anchorOpts.matchWidth ? { width: `${overlayRect.width}px` } : {}),
            ...(anchorOpts.matchHeight ? { height: `${overlayRect.height}px` } : {})
        },
        classes
    };
}

function removeOverlay() {
    window.removeEventListener('click', removeOverlay);
    dismissOverlayInjectionById(props.overlayId);
}

onMounted(() => {
    setTimeout(() => {
        window.addEventListener('click', removeOverlay);
    }, 10);
});
</script>

<style lang="scss">
.vf-overlay-anchor {
    position: absolute;
}
</style>
