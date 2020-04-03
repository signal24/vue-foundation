import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios' ;
Vue.use(VueAxios, axios)

import Config from '../config';

axios.interceptors.response.use(response => {
    // TODO: will Axios auto-reject non-JSON?
    if (response.data && typeof response.data != 'object') {
        throw new Error('response was not JSON');
    }

    return response;
},

err => {
    if (err.response && err.response.status == 401) {
        if (Config.unauthorizedHttpResponseHandler) {
            Config.unauthorizedHttpResponseHandler(err.response);
            return new Promise(() => {});
        }
    }
    
    if (err.response && err.response.data && err.response.data.error) {
        err.code = err.response.status == 422 ? 'USERERR' : 'APIERR';
        err.message = err.response.data.error;
        err.field = err.response.data.errorField;
    }
    
    throw err;
});