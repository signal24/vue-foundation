import Vue from 'vue';
import InfiniteScrollHook from '../plugins/infinite-scroll/hook';

Vue.directive('infinite-scroll', {
    bind(el, binding) {
        if (binding.value) {
            el._infiniteScrollHook = new InfiniteScrollHook(el, binding.value);
            el._infiniteScrollHook.install();
        }
    },

    unbind(el) {
        if (el._infiniteScrollHook) {
            el._infiniteScrollHook.uninstall();
        }
    }
});