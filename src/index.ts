import type { App } from 'vue';

export * from './components';
export { configureVf } from './config';
export * from './filters';
export * from './helpers';
export * from './hooks';
export * from './types';

import { registerDirectives } from './directives';

export function installVf(app: App) {
    registerDirectives(app);
}
