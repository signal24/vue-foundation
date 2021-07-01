import app from '../app';

import AjaxSelect from './ajax-select'
app.component('AjaxSelect', AjaxSelect);

// do not register Alert with Vue or our customizations to
// on-the-fly alerts won't take effect, as Vue will use
// the already-cached 'Alert' component instead of recompiling
// TODO: ^ is this for mutating Alert during dev, or...?
import Alert from './alert'
Alert;

import Modal from './modal'
app.component('Modal', Modal);

import SmartSelect from './smart-select'
app.component('SmartSelect', SmartSelect);