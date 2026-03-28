import type { Theme } from 'vitepress';

import { configureVf, installVf } from '@zyno-io/vue-foundation';
import DefaultTheme from 'vitepress/theme';

import DemoContainer from './DemoContainer.vue';
import VfSetup from './VfSetup.vue';
import '../../../dist/vue-foundation.css';
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
