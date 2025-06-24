import { createApp } from 'vue';

import { configureVf } from '@/config';
import { installVf } from '@/index';

import DemoRoot from './components/demo-root.vue';

const app = createApp(DemoRoot);
installVf(app);
configureVf({});

app.mount(document.body);
