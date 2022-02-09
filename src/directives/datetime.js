import moment from 'moment';

import app from '../app';

app.directive('datetime', {
    beforeMount: applyDateTime,
    updated: applyDateTime
});

function applyDateTime(el, binding) {
    if (binding.value == binding.oldValue && el.innerHTML.length) return;
    el.innerText = getDateTimeValue(el, binding);
}

function getDateTimeValue(el, binding) {
    if (!binding.value) {
        return el.attributes.placeholder ? el.attributes.placeholder.value : '';
    }

    let prefix = '';
    let thatMoment = el.attributes.local ? moment(binding.value) : moment.utc(binding.value);

    if (!el.attributes['display-utc']) thatMoment.local();

    let format = el.attributes.format ? el.attributes.format.value : null;

    if (!format && el.attributes['relative-date']) {
        let thisMoment = moment();
        if (
            thisMoment.year() == thatMoment.year() &&
            thisMoment.month() == thatMoment.month() &&
            thisMoment.date() == thatMoment.date()
        ) {
            prefix = 'at';
            format = 'HH:mm';
        }
    }

    if (!format) format = 'MM/DD/YY HH:mm';

    let result = thatMoment.format(format);

    if (prefix) result = prefix + ' ' + result;

    return result;
}
