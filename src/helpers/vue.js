import app from '../app';

app.config.globalProperties.$isPropTruthy = function (value) {
    return value !== undefined && (value === '' || value);
};
