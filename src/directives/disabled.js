import $ from 'jquery';

import app from '../app';

app.directive('disabled', {
    beforeMount: fn,
    updated: fn,
    unmounted
});

function fn(el, binding) {
    if (el.tagName == 'LABEL') {
        $(el).toggleClass('disabled', !!binding.value);
        el = $(el).find('input')[0];
    }

    if (binding.value) $(el).attr('disabled', 'disabled');
    else $(el).removeAttr('disabled');
}

function unmounted(el) {
    if (el.tagName == 'LABEL') {
        $(el).removeClass('disabled');
        el = $(el).find('input')[0];
    }

    $(el).removeAttr('disabled');
}
