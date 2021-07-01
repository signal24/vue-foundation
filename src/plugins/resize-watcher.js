import Vue from 'vue'

// TODO: find out if we can use the Vue options array for the functions instead of making them part of "methods"

class ResizeWatcher {
    static install(app, options) {
        app.mixin({
            mounted() {
                if (this.$options.windowResized) {
                    this._resizeWatcherHandler = this.$options.windowResized.bind(this);
                    window.addEventListener('resize', this._resizeWatcherHandler);
                }
            },

            activated() {
                this._resizeWatcherHandler && window.addEventListener('resize', this._resizeWatcherHandler);
            },

            deactivated() {
                this._resizeWatcherHandler && window.removeEventListener('resize', this._resizeWatcherHandler);
            },

            beforeUnmount() {
                this._resizeWatcherHandler && window.removeEventListener('resize', this._resizeWatcherHandler);
            }
        });
    }
}

export default ResizeWatcher;