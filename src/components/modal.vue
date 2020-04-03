<template>
    <div class="vf-overlay vf-modal-wrap">
        <form action="." class="vf-modal" :class="{ scrolls: scrolls !== undefined }" @submit.prevent="$emit('form-submit')">
            <div v-if="$slots.header" class="vf-modal-header">
                <slot name="header" />
                <i v-if="this['closeX'] !== undefined" class="close" @click="$parent.$dismiss()"></i>
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
        
        if (this.closeOnMaskClick !== undefined && this.closeOnMaskClick !== false) {
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

let modalConfigCache = {};

Vue.mixin({
    beforeCreate() {
        let identifier = this.constructor.options.__file || this.constructor.options.__modalId;

        if (identifier && modalConfigCache[identifier]) {
            let config = modalConfigCache[identifier];
            let modalOptions = this.constructor.options.modal || {};

            if (config.data) {
                this.$options.data = function() {
                    let data = this.constructor.options.data ? this.constructor.options.data.apply(this) : {};

                    let keepOriginal = config.keepOriginal || [];
                    let injectedData = config.data;
                    for (let key in injectedData) {
                        if (!keepOriginal.includes(key)) {
                            if (typeof(injectedData[key]) == 'object' && injectedData[key].constructor === Object) {
                                injectedData[key] = cloneDeep(injectedData[key]);
                            } else {
                                injectedData[key] = injectedData[key];
                            }
                        }
                    }

                    Object.assign(data, injectedData);

                    return data;
                };
            }

            this.$dismiss = (...args) => {
                // this allows the form submission handler to run before the form is destroyed,
                // in the event the submit button has a click handler. otherwise, the console will
                // report "Form submission canceled because the form is not connected."
                setTimeout(() => {
                    delete modalConfigCache[identifier];

                    let rootInjections = Config.rootInstance.store.rootInjections;
                    let thisInjection = window.__VUE_HOT_MAP__ ?
                        rootInjections.find(injection => injection.__file == this.constructor.options.__file) :
                        rootInjections.find(injection => injection._Ctor[0] == this.constructor.options._Ctor[0]);
                    rootInjections.remove(thisInjection);
                    
                    this.$nextTick(() => {
                        config.resolve.apply(this, args);
                    });
                }, 0);
            };

            this.$opener = config.opener;

            config.instanceCreationCallback && config.instanceCreationCallback(this);

            // TODO: why not when there's a Vue hot map?
            if (!window.__VUE_HOT_MAP__)
                delete modalConfigCache[identifier];
        }
    }
});

Vue.prototype.$modal = function(classDef, data, instanceCreationCallback) {
    return new Promise((resolve, reject) => {
        const identifier = classDef.__modalId = classDef.__modalId || classDef.__file || Math.random().toString(36).substring(2, 10);
        modalConfigCache[identifier] = { data, resolve, reject, instanceCreationCallback, opener: this };
        this.$nextTick(() => {
            Config.rootInstance.store.rootInjections.push(classDef);
        });
    });
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