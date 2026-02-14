<template>
    <div :id="id" ref="overlay" class="vf-overlay vf-modal-wrap" :class="classList">
        <form ref="form" action="." class="vf-modal" :class="{ scrolls }" @submit.prevent="$emit('formSubmit')">
            <div v-if="$slots.header" class="vf-modal-header">
                <slot name="header" />
                <i v-if="props.closeX" class="close" @click="closeParent"></i>
            </div>
            <div class="vf-modal-content">
                <slot />
            </div>
            <div v-if="$slots.footer" class="vf-modal-footer">
                <slot name="footer" />
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { compact } from 'lodash';
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';

import { maskForm, unmaskForm } from '../helpers/mask';
import { dismissOverlayInjectionByInternalInstance } from './overlay-container';

const instance = getCurrentInstance();

const props = defineProps<{
    id?: string;
    closeOnMaskClick?: boolean;
    scrolls?: boolean;
    closeX?: boolean;
    class?: string | string[];
    onClose?: () => void;
}>();

defineEmits(['formSubmit']);
defineExpose({ mask, unmask, hide, unhide });

const overlay = ref<HTMLElement>();
const form = ref<HTMLFormElement>();

const isHidden = ref(false);
const isCovered = ref(false);

const classList = computed(() => {
    return compact([...(Array.isArray(props.class) ? props.class : [props.class]), isHidden.value && 'hidden', isCovered.value && 'is-covered']);
});

let observer: MutationObserver | undefined;

onMounted(() => {
    document.body.classList.add('vf-modal-open');

    if (props.closeOnMaskClick) {
        window.addEventListener('keydown', handleEscapeKey);
        overlay.value?.addEventListener('click', handleOverlayClick);
    }

    const parent = overlay.value?.parentElement;
    if (parent) {
        checkIfCovered();
        observer = new MutationObserver(mutations => {
            let checkNeeded = false;
            for (const m of mutations) {
                if (m.type === 'childList') {
                    if (m.target === parent) {
                        checkNeeded = true;
                        break;
                    }
                } else if (m.type === 'attributes' && m.attributeName === 'class') {
                    // Check if target is a sibling overlay (direct child of parent)
                    // Note: m.target is Node, need to cast to Element to check parentElement
                    const target = m.target as Element;
                    if (target.parentElement === parent) {
                        checkNeeded = true;
                        break;
                    }
                }
            }
            if (checkNeeded) {
                checkIfCovered();
            }
        });

        observer.observe(parent, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscapeKey);

    const areOtherModalsOpen = document.body.querySelectorAll('.vf-modal').length > 0;
    if (!areOtherModalsOpen) document.body.classList.remove('vf-modal-open');

    observer?.disconnect();
});

function checkIfCovered() {
    if (!overlay.value || !overlay.value.parentElement) return;

    const siblings = Array.from(overlay.value.parentElement.children);
    const myIndex = siblings.indexOf(overlay.value);

    let covered = false;
    for (let i = myIndex + 1; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling && sibling.classList.contains('vf-modal-wrap') && !sibling.classList.contains('hidden')) {
            covered = true;
            break;
        }
    }
    isCovered.value = covered;
}

function handleOverlayClick(e: MouseEvent) {
    if (e.target == overlay.value) {
        closeParent();
    }
}

function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === 'Esc' || e.key === 'Escape') {
        const modalWraps = document.querySelectorAll('.vf-modal-wrap');
        // make sure we're the topmost modal
        if (modalWraps[modalWraps.length - 1] === overlay.value) {
            closeParent();
        }
    }
}

function closeParent() {
    if (props.onClose) {
        props.onClose();
    } else {
        dismissOverlayInjectionByInternalInstance(instance!);
    }
}

function mask() {
    maskForm(form.value!);
    return () => unmask();
}

function unmask() {
    unmaskForm(form.value!);
}

function hide() {
    isHidden.value = true;
    return () => unhide();
}

function unhide() {
    isHidden.value = false;
}
</script>

<style lang="scss">
.vf-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    &.hidden {
        display: none;
    }
}

.vf-modal-wrap {
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;

    &.is-covered {
        background: transparent;
    }
}

.vf-modal {
    background: white;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    max-width: 95%;
    max-height: 95%;
    display: flex;
    flex-direction: column;
}

.vf-modal-header {
    flex-shrink: 0;
    position: relative;
}

.vf-modal-footer {
    flex-shrink: 0;
    position: relative;
}

.vf-modal.scrolls > .vf-modal-content {
    overflow: auto;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
}
</style>
