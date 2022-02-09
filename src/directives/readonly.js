import $ from 'jquery';

import app from '../app';

app.directive('readonly', {
    beforeMount: fn,
    updated: fn
});

function fn(el, binding) {
    if (el.tagName == 'LABEL') {
        el = $(el).find('input')[0];
    }

    if (binding.value) $(el).attr('readonly', 'readonly');
    else $(el).removeAttr('readonly');
}
