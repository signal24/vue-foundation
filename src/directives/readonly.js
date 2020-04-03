import Vue from 'vue';
import $ from 'jquery';

Vue.directive('readonly', {
    bind: fn,
    update: fn
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