import app from '../app';
import $ from 'jquery';

app.directive('readonly', {
    beforeMount: fn,
    updated: fn
});

function fn(el, binding) {
    if (el.tagName == 'LABEL') {
        el = $(el).find('input')[0];
    }

    if (binding.value)
        $(el).attr('readonly', 'readonly')
    else
        $(el).removeAttr('readonly');
}