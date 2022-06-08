<template>
    <Teleport to="#vf-modal-target">
        <div class="vf-overlay vf-modal-wrap" :class="class">
            <form
                action="."
                class="vf-modal"
                :class="{ scrolls: $isPropTruthy(this.scrolls) }"
                @submit.prevent="$emit('formSubmit')"
            >
                <div v-if="$slots.header" class="vf-modal-header">
                    <slot name="header" />
                    <i v-if="$isPropTruthy(this.closeX)" class="close" @click="$parent.$dismiss()"></i>
                </div>
                <div class="vf-modal-content">
                    <slot />
                </div>
                <div v-if="$slots.footer" class="vf-modal-footer">
                    <slot name="footer" />
                </div>
            </form>
        </div>
    </Teleport>
</template>

<script>
export default {
    props: ['closeOnMaskClick', 'scrolls', 'closeX', 'class'],
    emits: ['formSubmit'],

    beforeCreate() {
        const targetEl = document.getElementById('vf-modal-target') ?? document.createElement('div');
        targetEl.id = 'vf-modal-target';
        targetEl.removeAttribute('inert');
        document.body.appendChild(targetEl);
    },

    mounted() {
        window.addEventListener('keydown', this.handleEscapeKey);
        document.body.classList.add('vf-modal-open');

        if (this.$isPropTruthy(this.closeOnMaskClick)) {
            this.$el.addEventListener('click', e => {
                if (e.target == this.$el) this.$parent.$dismiss();
            });
        }
    },

    unmounted() {
        window.removeEventListener('keydown', this.handleEscapeKey);

        let areOtherModalsOpen = document.body.querySelectorAll('.vf-modal').length > 0;
        areOtherModalsOpen || document.body.classList.remove('vf-modal-open');
    },

    methods: {
        handleEscapeKey(e) {
            if (e.key === 'Esc' || e.key === 'Escape') {
                const modalWraps = document.querySelectorAll('.vf-modal-wrap');
                if (modalWraps[modalWraps.length - 1] === this.$el) {
                    this.$parent.$dismiss();
                }
            }
        }
    }
};

import app from '../app';
import { markRaw } from 'vue';
import cloneDeep from 'lodash/cloneDeep';

let modalConfigs = {};

function bootModal(modalId) {
    const config = modalConfigs[modalId];

    this.$modalOpener = config.opener;
    this.$modalResult = undefined;

    this.$options.storeParent = this.$modalOpener;

    let originalDataFn = this.$options.data;
    this.$options.data = function () {
        const injectedData = config.injectedData || {};
        const keepOriginalKeys = this.$options.keepOriginal || [];
        let data = originalDataFn ? originalDataFn.apply(this) : {};

        for (let key in injectedData) {
            if (!keepOriginalKeys.includes(key)) {
                if (
                    injectedData[key] !== null &&
                    typeof injectedData[key] == 'object' &&
                    injectedData[key].constructor === Object
                ) {
                    data[key] = cloneDeep(injectedData[key]);
                } else {
                    data[key] = injectedData[key];
                }
            }
        }

        return data;
    };

    this.$dismiss = (...args) => {
        return new Promise(resolve => {
            // setTimeout allows the form submission handler to run before the form is unmounted,
            // in the event the submit button has a click handler. otherwise, the console will
            // report "Form submission canceled because the form is not connected."
            setTimeout(() => {
                delete modalConfigs[modalId];

                let rootInjections = app.vm.store.rootInjections;

                const rootInjection = rootInjections.find(injection => injection.__modalId === modalId);
                if (!rootInjection) return;

                rootInjections.remove(rootInjection);
                this.$nextTick(() => {
                    config.resolve.apply(this, args[0] !== undefined ? args : this.$modalResult);
                    resolve();
                });
            }, 0);
        });
    };

    config.instanceCreationCallback && config.instanceCreationCallback(this);
}

app.mixin({
    beforeCreate() {
        const modalId = this.$options.__modalId || this.$options.__file;
        if (modalId && modalConfigs[modalId]) bootModal.call(this, modalId);
    }
});

app.config.globalProperties.$modal = function (classDef, injectedData, instanceCreationCallback) {
    return new Promise((resolve, reject) => {
        const modalId = classDef.__modalId || classDef.__file || Math.random().toString(36).substring(2, 10);
        classDef.__modalId = modalId;

        modalConfigs[modalId] = {
            opener: this,
            injectedData,
            instanceCreationCallback,
            resolve
        };

        this.$nextTick(() => {
            app.vm.store.rootInjections.push(markRaw(classDef));
        });
    });
};

// TODO: see about a injecting a root modal container & HMR inside it
// modals, on render, can hot move themselves to body end
</script>

<style lang="scss">
.vf-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.vf-modal-wrap {
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
}

// TODO: make modal backgrounds not stack, except don't make the top-most modal transparent if there's
// a context menu or dropdown on top of it
// .vf-modal-wrap:not(:last-child) {
//     background: transparent;
// }

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
