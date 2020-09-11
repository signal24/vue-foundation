import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

Vue.prototype.$http.postOrPut = (baseUrl, id, ...args) => {
    const method = id ? 'put' : 'post';
    const url = id ? `${baseUrl}/${id}` : baseUrl;
    return Vue.prototype.$http[method](url, ...args);
};

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
            const result = Config.unauthorizedHttpResponseHandler(err.response);
            if (!result) throw err;
        }
    }
    
    if (err.response && err.response.data && err.response.data.error) {
        err.code = err.response.status == 422 ? 'USERERR' : 'APIERR';
        err.message = err.response.data.error;
        err.field = err.response.data.errorField;
    }
    
    throw err;
});
