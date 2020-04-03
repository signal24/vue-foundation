import Vue from 'vue';

Vue.directive('user-text', {
    bind: fn,
    update: fn
});

function fn(el, binding) {
    if (binding.value == binding.oldValue) return;
    el.innerHTML = binding.value.escapeHtml().replace(/\n/g, '<br>');
}