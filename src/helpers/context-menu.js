import $ from 'jquery';

import app from '../app';

app.config.globalProperties.$contextMenu = function (e, config) {
    var $wrapper = $('<div class="vf-overlay">').click(_closeMenu).appendTo(document.body);
    var $menu = $('<div class="vf-context-menu">').css('position', 'absolute').appendTo($wrapper);

    var $target = $(e.currentTarget);
    $target.css('user-select', 'none');

    $target.addClass('context-menu-active');

    config.targetClass && $target.addClass(config.targetClass);
    config.class && $menu.addClass(config.class);

    config.items &&
        config.items.forEach(item => {
            if (item == '-') return $('<div class="separator">').appendTo($menu);
            var $item = $('<div class="item">').css('user-select', 'none').text(item.title).appendTo($menu);
            item.class && $item.addClass(item.class);
            if (item.shouldConfirm) $item.data('handler', item.handler).click(_confirmAction);
            else if (item.handler) $item.click(item.handler);
        });

    const dx = window.innerWidth - e.clientX;
    const dy = window.innerHeight - e.clientY;
    const menuHeight = $menu.outerHeight();
    const menuWidth = $menu.outerWidth();

    const left = dx < menuWidth ? e.clientX - menuWidth - 1 : e.clientX + 1;
    const top = dy < menuHeight ? e.clientY - menuHeight - 1 : e.clientY + 1;

    $menu.css('left', left + 'px');
    $menu.css('top', top + 'px');

    config.onCreate && config.onCreate($menu[0]);

    setTimeout(() => {
        $menu.css('width', $menu.outerWidth() + 'px');
    }, 50);

    function _closeMenu() {
        config.targetClass && $target.removeClass(config.targetClass);
        $target.removeClass('context-menu-active');
        $target.css('user-select', '');
        $wrapper.remove();
    }

    function _confirmAction(e) {
        var $item = $(e.currentTarget);
        if ($item.hasClass('pending-confirm')) {
            var handler = $item.data('handler');
            handler && handler();
        } else {
            var originalContent = $item.html();
            $item.addClass('pending-confirm').text('Confirm');
            $item.one('mouseleave', function () {
                $item.removeClass('pending-confirm').html(originalContent);
            });
            e.stopPropagation();
        }
    }
};

// TODO: actually de-select text rather than just using CSS to hide its selection
