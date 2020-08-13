// REMINDER: if there is a node_modules folder here during development of another app linking to this dev build,
// the 'Vue' imports here will _not_ be the same as the 'Vue' imports from the app due to absolute path differences
// thus, nothing that's attached to Vue here will be attached to Vue there, and everything will be broken

import Config from './config'

import './components'
import './directives'
import './filters'
import './helpers'
import './plugins'

export default {
    configure,
    getStore,
    setRoot,
    getRoot
};

function configure(options) {
    Config.set(options);
}

function getStore(data) {
    // TODO: move the initial stuff into configure
    data = data || {};

    Object.assign(data, {
        session: null,
        globalError: window.gErr || null,
        rootInjections: []
    });
    
    return data;
}

function setRoot(root) {
    Config.rootInstance = root;
}

function getRoot() {
    return Config.rootInstance;
}