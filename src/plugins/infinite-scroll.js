// TODO: switch to intersection observer

import InfiniteScrollHook from './infinite-scroll/hook';

class InfiniteScroll {
    static install(app, options) {
        const scrollableValues = ['auto', 'scroll'];
        const discoverScrollableAncestorEl = function(el) {
            el = el.parentElement;
            if (!el) return null;

            const computedStyle = window.getComputedStyle(el);
            if (scrollableValues.includes(computedStyle.overflow) || scrollableValues.includes(computedStyle.overflowX) || scrollableValues.includes(computedStyle.overflowY)) {
                return el;
            }

            return discoverScrollableAncestorEl(el);
        };

        const installScrollHook = function() {
            if (this.$options.windowScrolledToBottom) {
                this._windowScrollHook = new InfiniteScrollHook(window, this.$options.windowScrolledToBottom.bind(this));
                this._windowScrollHook.install();
            }

            if (this.$options.elScrolledToBottom) {
                this._elScrollHook = new InfiniteScrollHook(this.$el, this.$options.elScrolledToBottom.bind(this));
                this._elScrollHook.install();
            }

            if (this.$options.ancestorScrolledToBottom) {
                const scrollableAncestorEl = discoverScrollableAncestorEl(this.$el);
                if (scrollableAncestorEl) {
                    this._ancestorScrollHook = new InfiniteScrollHook(scrollableAncestorEl, this.$options.ancestorScrolledToBottom.bind(this));
                    this._ancestorScrollHook.install();
                } else {
                    console.warn('no scollable ancestor found for component:', this);
                }
            }
        };

        const reinstallScrollHook = function() {
            if (this._windowScrollHandler) {
                this._windowScrollHandler.install();
            }

            if (this._elScrollHandler) {
                this._elScrollHandler.install();
            }

            if (this._ancestorScrollHook) {
                this._ancestorScrollHook.install();
            }
        };

        const removeScrollHook = function() {
            if (this._windowScrollHandler) {
                this._windowScrollHandler.uninstall();
            }

            if (this._elScrollHandler) {
                this._elScrollHandler.uninstall();
            }

            if (this._ancestorScrollHook) {
                this._ancestorScrollHook.uninstall();
            }
        }

        app.mixin({
            mounted() {
                installScrollHook.call(this);
            },

            activated() {
                reinstallScrollHook.call(this);
            },

            deactivated() {
                removeScrollHook.call(this);
            },

            beforeUnmount() {
                removeScrollHook.call(this);
            }
        });
    }
}

export default InfiniteScroll;