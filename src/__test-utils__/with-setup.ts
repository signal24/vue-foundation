import { createApp, defineComponent } from 'vue';

export function withSetup<T>(composable: () => T) {
    let result!: T;
    const app = createApp(
        defineComponent({
            setup() {
                result = composable();
                return () => {};
            }
        })
    );
    app.mount(document.createElement('div'));
    return { result, app };
}
