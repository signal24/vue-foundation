import Vue from 'vue';
import moment from 'moment';

Vue.directive('date-input', {
    bind: fn
});

function fn(el, binding) {
    el.addEventListener('blur', () => {
        let val = el.value;
        if (/^[0-9]{1,2}\/[0-9]{1,2}$/.test(val))
            val += '/' + moment().format('YY');
        let ts = Date.parse(val);
        if (isNaN(ts))
            el.value = '';
        else
            el.value = moment(ts).format('MM/DD/YYYY');
        el.dispatchEvent(new Event('input'));
    });
}