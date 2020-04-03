// TODO: switch to intersection observer

class InfiniteScroll {
    static install(Vue, options) {
        const installScrollHook = function() {
            if (this.$options.windowScrolledToBottom) {
                let isTripped = false;
                this._windowScrollHandler = e => {
                    if (
                        Math.ceil(window.pageYOffset + window.innerHeight) >= document.body.scrollHeight &&
                        window.document.body.contains(this.$el)
                    ) {
                        if (!isTripped) {
                            this.$options.windowScrolledToBottom.call(this);
                            isTripped = true;
                        }
                    } else if (isTripped) {
                        isTripped = false;
                    }
                };

                window.addEventListener('scroll', this._windowScrollHandler);
            }

            if (this.$options.elScrolledToBottom) {
                let isTripped = false;
                this._elScrollHandler = e => {
                    if (Math.ceil(this.$el.scrollTop + this.$el.clientHeight) >= this.$el.scrollHeight) {
                        if (!isTripped) {
                            this.$options.elScrolledToBottom.call(this);
                            isTripped = true;
                        }
                    } else if (isTripped) {
                        isTripped = false;
                    }
                };

                this.$el.addEventListener('scroll', this._elScrollHandler);
            }
        };

        const reinstallScrollHook = function() {
            if (this._windowScrollHandler) {
                window.addEventListener('scroll', this._windowScrollHandler);
            }

            if (this._elScrollHandler) {
                this.$el.addEventListener('scroll', this._elScrollHandler);
            }
        };

        const removeScrollHook = function() {
            if (this._windowScrollHandler) {
                window.removeEventListener('scroll', this._windowScrollHandler);
            }

            if (this._elScrollHandler) {
                this.$el.removeEventListener('scroll', this._elScrollHandler);
            }
        }

        Vue.mixin({
            mounted() {
                installScrollHook.call(this);
            },

            activated() {
                reinstallScrollHook.call(this);
            },

            deactivated() {
                removeScrollHook.call(this);
            },

            beforeDestroy() {
                removeScrollHook.call(this);
            }
        });
    }
}

export default InfiniteScroll;