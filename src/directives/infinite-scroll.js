import app from '../app';
import InfiniteScrollHook from '../plugins/infinite-scroll/hook';

app.directive('infinite-scroll', {
    beforeMount(el, binding) {
        if (binding.value) {
            el._infiniteScrollHook = new InfiniteScrollHook(el, binding.value);
            el._infiniteScrollHook.install();
        }
    },

    unmounted(el) {
        if (el._infiniteScrollHook) {
            el._infiniteScrollHook.uninstall();
        }
    }
});
