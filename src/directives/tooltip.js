import app from '../app';
import $ from 'jquery';

app.directive('tip', {
    mounted: createTip,
    updated: createTip,
    unmounted: destroyTip
});

function createTip(el, binding, vnode, oldVnode) {
    let tipText = el.attributes.tip ? el.attributes.tip.value : binding.value;
    if (binding.value === false)
        tipText = null;
    if (tipText) {
        let config = {};
        config[binding.modifiers.html ? 'html' : 'text'] = tipText;
        if (el.attributes['tip-class'])
            config.class = el.attributes['tip-class'].value;
        $(el).vfTooltip(config);
    }
    else
        $(el).vfTooltip('destroy');
}

function destroyTip(el) {
    $(el).vfTooltip('destroy');
}

$.fn.vfTooltip = function(option) {
    return this.each(function(index, el) {
        var tooltip = $(el).data('vf-tooltip');

        if (typeof(option) == 'string') {
            if (!tooltip) return;
            tooltip[option]();
        }
        else if (tooltip) {
            tooltip.configure(option);
        }
        else {
            var tooltip = new VfTooltip(el, option);
            $(el).data('vf-tooltip', tooltip);
        }
    });
}

function VfTooltip(el, configIn) {
    // exports
    this.configure = _configure;
    this.destroy = _destroy;

    // state
    var $tip, config, lastMoveEvt, checkInterval, shouldShow = false;

    // apply config
    this.configure(configIn);

    var $target = $(el);
    $target.on('mouseenter', _handleTargetMouseEnter);
    $target.on('mouseleave', _handleTargetMouseLeave);

    config.now && _handleTargetMouseEnter(config.now);

    function _configure(configIn) {
        config = $.extend({
            delay: 0
        }, configIn);
    }

    function _handleTargetMouseEnter(e) {
        if (shouldShow) return;

        shouldShow = true;

        setTimeout(function() {
            if (!shouldShow) return;

            _renderTooltip();

            if (config.static)
                _placeStaticTooltip();
            else
                _handleMouseMove(e);

            $tip.show();
        }, config.delay);
    }

    function _handleTargetMouseLeave(e) {
        shouldShow = false;
        _deferredRemoveTooltip();
    }

    function _renderTooltip() {
        if (!$tip)
            config.static || $(window).on('mousemove', _handleMouseMove);
        else
            $tip.remove();

        $tip = $('<div class="vf-tooltip">').css('position', 'absolute').css('z-index', '1000000').addClass(config.class).appendTo(document.body);
        config.title && $('<div class="title">').text(config.title).appendTo($tip);
        var $content = $('<div class="content">').appendTo($tip);

        if (config.callback)
            config.callback($content[0]);
        else if (config.text)
            $content.text(config.text).html($content.html().replace(/\n/g, '<br>'));
        else if (config.html)
            $content.html(config.html);

        if (config.static) {
            $tip.mouseover(function() {
                shouldShow = true;
            }).mouseout(function() {
                shouldShow = false;
                _deferredRemoveTooltip();
            });
        }

        else {
            checkInterval = setInterval(_checkMoveEvent, 250);
        }
    }

    function _deferredRemoveTooltip() {
        if (config.static)
            setTimeout(_removeTooltip, 50);
        else
            _removeTooltip();
    }

    function _removeTooltip() {
        if (shouldShow) return;
        if (!$tip) return;

        $tip.remove();
        $tip = null;

        clearInterval(checkInterval);

        config.static || $(window).off('mousemove', _handleMouseMove);
    }

    function _placeStaticTooltip() {
        var targetPosition = $target.position();
        var tipHeight = $tip.height();
        var tipW = $target.outerWidth(true);
        var tipX = targetPosition.left;
        var tipY = targetPosition.top - tipHeight - 1;
        if (tipY - 2 < 0) tipY = targetPosition.top + $target.outerHeight(true) + 1;
        $tip.css('min-width', tipW + 'px').css('left', tipX + 'px').css('top', tipY + 'px');
    }

    function _handleMouseMove(e) {
        var tipWidth = $tip.outerWidth(), tipHeight = $tip.outerHeight();
        var viewWidth = window.innerWidth, viewHeight = window.innerHeight;
        var tipX = e.pageX + 10, tipY = e.pageY + 20;
        if (tipX + tipWidth > viewWidth)
            tipX = e.pageX - 5 - tipWidth;
        if (tipY + tipHeight > viewHeight)
            tipY = e.pageY - 5 - tipHeight;
        $tip.css('left', tipX + 'px').css('top', tipY + 'px');
        lastMoveEvt = e;
    }

    function _checkMoveEvent() {
        if (!lastMoveEvt) return;
        if (el != lastMoveEvt.target && !$.contains(el, lastMoveEvt.target))
            _handleTargetMouseLeave();
    }

    function _destroy() {
        shouldShow = false;

        _removeTooltip();

        $target.off('mouseenter', _handleTargetMouseEnter);
        $target.off('mouseleave', _handleTargetMouseLeave);
        $target.removeData('vf-tooltip');
    }
}