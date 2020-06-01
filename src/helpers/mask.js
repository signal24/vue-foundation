import Vue from 'vue'
import $ from 'jquery'

/*///////////////////////////////////////////////
Masking
//////////////////////////////////////////////*/
Vue.prototype.$mask = function(message) {
    let $el = $(this.$el);
    this.$maskEl($el.hasClass('vf-overlay') ? $el.find('.vf-modal')[0] : this.$el, message);
}

Vue.prototype.$maskEl = function(el, message) {
    if (this._currentMask) return;
    this._currentMask = $('<div class="mask">').text(message || 'Please wait...').appendTo(el);
}

Vue.prototype.$unmask = function() {
    if (!this._currentMask) return;
    $(this._currentMask).remove();
    delete this._currentMask;
}

Vue.prototype.$maskForm = function(waitButton, waitText) {
    let el = this.$el;
    if (waitButton.tagName == 'FORM') {
        el = waitButton;
        waitButton = null;
    }
    let $form = el.tagName == 'FORM' ? $(el) : $(el).find('form');
    let $inputs = $form.find('input, select, textarea, button').not('[disabled]');
    $form.addClass('masked');
    $form.data('vf-masked-inputs', $inputs);
    $inputs.attr('disabled', 'disabled');
    if (waitButton) {
        let $waitButton = $form.find(waitButton);
        $waitButton.disable(waitText || 'Please wait...');
        $form.data('vf-masked-wait-btn', $waitButton);
    }
}

Vue.prototype.$unmaskForm = function() {
    let $form = this.$el.tagName == 'FORM' ? $(this.$el) : $(this.$el).find('form.masked');
    if (!$form.length) return;
    let $inputs = $form.data('vf-masked-inputs');
    $inputs.removeAttr('disabled');
    $form.removeData('vf-masked-inputs');
    let $waitButton = $form.data('vf-masked-wait-btn');
    if ($waitButton) {
        $form.removeData('vf-masked-wait-btn');
        $waitButton.enable();
    }
    $form.removeClass('masked');
}

/*///////////////////////////////////////////////
Button Enable/Disable
//////////////////////////////////////////////*/
$.fn.disable = function(newText) {
    this.each(function(index, item) {
        var $item = $(item);
        var isInput = item.tagName == 'INPUT';
        newText && $item.data('originalValue', isInput ? $item.val() : $item.html()) && $item[isInput ? 'val' : 'text'](newText);
        $item.attr('disabled', 'disabled');
    });
    return this;
}

$.fn.enable = function() {
    this.each(function(index, item) {
        var $item = $(item);
        $item.removeAttr('disabled');
        var originalValue = $item.data('originalValue');
        originalValue != undefined && $item[item.tagName == 'INPUT' ? 'val' : 'html'](originalValue) && $item.removeData('originalValue');
    });
    return this;
}