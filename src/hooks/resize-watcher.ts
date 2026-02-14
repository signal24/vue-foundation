import { throttle } from 'lodash';
import { onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue';

export function useResizeWatcher(fn: () => void) {
    const throttledFn = throttle(fn, 200);

    onMounted(() => window.addEventListener('resize', throttledFn));
    onActivated(() => window.addEventListener('resize', throttledFn));
    onDeactivated(() => {
        window.removeEventListener('resize', throttledFn);
        throttledFn.cancel();
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', throttledFn);
        throttledFn.cancel();
    });
}
