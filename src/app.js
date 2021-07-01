import { createApp, h } from 'vue'

let rootComponent;
function setRootComponent(inComponent) {
    rootComponent = inComponent;
}

const app = createApp({
    data() {
        return {
            store: {
                session: null,
                globalError: window.gErr || null,
                rootInjections: []
            }
        };
    },

    render() {
        return h(rootComponent)
    }
});

export { setRootComponent };
export default app;
