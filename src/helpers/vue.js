import Vue from 'vue';

Vue.prototype.$isPropTruthy = function(value) {
    return value !== undefined && (value === '' || value);
};