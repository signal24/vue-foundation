import moment from 'moment';

import app from '../app';

app.directive('date-input', {
    beforeMount: fn
});

function fn(el) {
    el.addEventListener('blur', () => {
        let val = el.value;
        if (/^[0-9]{1,2}\/[0-9]{1,2}$/.test(val)) val += '/' + moment().format('YY');
        let ts = Date.parse(val);
        if (isNaN(ts)) el.value = '';
        else el.value = moment(ts).format('MM/DD/YYYY');
        el.dispatchEvent(new Event('input'));
    });
}
