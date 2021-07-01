// REMINDER: if there is a node_modules folder here during development of another app linking to this dev build,
// the 'Vue' imports here will _not_ be the same as the 'Vue' imports from the app due to absolute path differences
// thus, nothing that's attached to Vue here will be attached to Vue there, and everything will be broken

import vfConfig from './config';

import app, { setRootComponent } from './app';
import './components';
import './directives';
import './filters';
import './helpers';
import './plugins';

export default {
    configure,
    mount,
    getApp
};

function configure(options) {
    vfConfig.set(options);
}

function mount(rootComponent, target) {
    setRootComponent(rootComponent);
    app.vm = app.mount(target);
}

function getApp() {
    return app;
}