<template>
    <div class="vf-overlay vf-modal-wrap">
        <form action="." class="vf-modal" :class="{ scrolls: $isPropTruthy(this.scrolls) }" @submit.prevent="$emit('form-submit')">
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
</template>

<script>
export default {
    props: ['closeOnMaskClick', 'scrolls', 'closeX'],

    mounted() {
        window.addEventListener('keydown', this.handleEscapeKey);
        document.body.classList.add('vf-modal-open');
        
        if (this.$isPropTruthy(this.closeOnMaskClick)) {
            this.$el.addEventListener('click', e => {
                if (e.target == this.$el)
                    this.$parent.$dismiss();
            });
        }
    },

    destroyed() {
        window.removeEventListener('keydown', this.handleEscapeKey);

        let areOtherModalsOpen = document.body.querySelectorAll('.vf-modal').length > 0;
        areOtherModalsOpen || document.body.classList.remove('vf-modal-open');
    },

    methods: {
        handleEscapeKey(e) {
            if (e.key === 'Esc' || e.key === 'Escape') {
                this.$parent.$dismiss();
            }
        }
    }
}

import Vue from 'vue';
import Config from '../config';
import cloneDeep from 'lodash/cloneDeep';

let modalConfigs = {};

function bootModal(modalId) {
    if (!this.constructor.options.name && this.constructor.extendOptions && this.constructor.extendOptions.__file) {
        this.constructor.options.name = this.constructor.extendOptions.__file.replace(/^.*\//g, '').replace(/\.vue$/, '');
    }

    const config = modalConfigs[modalId];
    
    this.$opener = config.opener;

    let originalDataFn = this.$options.data;
    this.$options.data = function() {
        const injectedData = config.injectedData || {};
        const keepOriginalKeys = this.$options.keepOriginal || [];
        let data = originalDataFn ? originalDataFn.apply(this) : {};

        for (let key in injectedData) {
            if (!keepOriginalKeys.includes(key)) {
                if (typeof(injectedData[key]) == 'object' && injectedData[key].constructor === Object) {
                    data[key] = cloneDeep(injectedData[key]);
                } else {
                    data[key] = injectedData[key];
                }
            }
        }

        return data;
    };

    this.$dismiss = (...args) => {
        // setTimeout allows the form submission handler to run before the form is destroyed,
        // in the event the submit button has a click handler. otherwise, the console will
        // report "Form submission canceled because the form is not connected."
        setTimeout(() => {
            delete modalConfigs[modalId];

            let rootInjections = Config.rootInstance.store.rootInjections;
            
            const rootInjection = rootInjections.find(injection => injection.__modalId === modalId);
            if (!rootInjection) return;

            rootInjections.remove(rootInjection);
            this.$nextTick(() => {
                config.resolve.apply(this, args);
            });
        }, 0);
    };

    config.instanceCreationCallback && config.instanceCreationCallback(this);
}

Vue.mixin({
    beforeCreate() {
        const modalId = this.constructor.options.__modalId || (this.constructor.extendOptions && this.constructor.extendOptions.__file);
        if (modalId && modalConfigs[modalId]) bootModal.call(this, modalId);
    }
});

Vue.prototype.$modal = function(classDef, injectedData, instanceCreationCallback) {
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
            Config.rootInstance.store.rootInjections.push(classDef);
        });
    });
}

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
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,.15);
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