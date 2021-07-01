// TODO: switch to intersection observer

import InfiniteScrollHook from './infinite-scroll/hook';

class InfiniteScroll {
    static install(app, options) {
        const installScrollHook = function() {
            if (this.$options.windowScrolledToBottom) {
                this._windowScrollHook = new InfiniteScrollHook(window, this.$options.windowScrolledToBottom.bind(this));
                this._windowScrollHook.install();
            }

            if (this.$options.elScrolledToBottom) {
                this._elScrollHook = new InfiniteScrollHook(this.$el, this.$options.elScrolledToBottom.bind(this));
                this._elScrollHook.install();
            }
        };

        const reinstallScrollHook = function() {
            if (this._windowScrollHandler) {
                this._windowScrollHandler.install();
            }

            if (this._elScrollHandler) {
                this._elScrollHandler.install();
            }
        };

        const removeScrollHook = function() {
            if (this._windowScrollHandler) {
                this._windowScrollHandler.uninstall();
            }

            if (this._elScrollHandler) {
                this._elScrollHandler.uninstall();
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