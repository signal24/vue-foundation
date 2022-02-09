import app from '../app';

app.directive('user-text', {
    beforeMount: fn,
    updated: fn
});

function fn(el, binding) {
    if (binding.value == binding.oldValue) return;
    el.innerHTML = binding.value.escapeHtml().nl2br();
}
