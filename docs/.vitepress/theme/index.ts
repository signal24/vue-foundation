import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import { configureVf, installVf } from '@signal24/vue-foundation';

import DemoContainer from './DemoContainer.vue';
import VfSetup from './VfSetup.vue';
import './style.css';

export default {
    extends: DefaultTheme,
    Layout: VfSetup,
    enhanceApp({ app }) {
        installVf(app);
        configureVf({});
        app.component('DemoContainer', DemoContainer);
    }
} satisfies Theme;
