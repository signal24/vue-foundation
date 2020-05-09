import Vue from 'vue';
import $ from 'jquery';

Vue.directive('disabled', {
    bind: fn,
    update: fn,
    unbind: unbind
});

function fn(el, binding) {
    if (el.tagName == 'LABEL') {
        $(el).toggleClass('disabled', !!binding.value);
        el = $(el).find('input')[0];
    }

    if (binding.value)
        $(el).attr('disabled', 'disabled')
    else
        $(el).removeAttr('disabled');
}

function unbind(el) {
    if (el.tagName == 'LABEL') {
        $(el).removeClass('disabled');
        el = $(el).find('input')[0];
    }
    
    $(el).removeAttr('disabled');
}
