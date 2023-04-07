import { onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue';

export function useResizeWatcher(fn: () => void) {
    onMounted(() => window.addEventListener('resize', fn));
    onActivated(() => window.addEventListener('resize', fn));
    onDeactivated(() => window.removeEventListener('resize', fn));
    onBeforeUnmount(() => window.removeEventListener('resize', fn));
}
