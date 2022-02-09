import axios from 'axios';

import app from '../app';
app.config.globalProperties.$http = axios;

axios.postOrPut = (baseUrl, id, ...args) => {
    const method = id ? 'put' : 'post';
    const url = id ? `${baseUrl}/${id}` : baseUrl;
    return axios[method](url, ...args);
};

import vfConfig from '../config';

axios.interceptors.response.use(
    response => {
        // TODO: will Axios auto-reject non-JSON?
        if (response.data && typeof response.data != 'object') {
            throw new Error('response was not JSON');
        }

        return response;
    },

    err => {
        if (err.response && err.response.status == 401) {
            if (vfConfig.unauthorizedHttpResponseHandler) {
                const result = vfConfig.unauthorizedHttpResponseHandler(err.response);

                // if the handler said "ok, handled", then we're going to
                // return a promise that never resolves to prevent the userland code
                // from ever proceeding
                if (result) return new Promise(() => {});
            }
        }

        if (err.response && err.response.data && err.response.data.error) {
            err.code = err.response.status == 422 ? 'USERERR' : 'APIERR';
            err.message = err.response.data.error;
            err.field = err.response.data.errorField;
        }

        throw err;
    }
);
