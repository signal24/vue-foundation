// TODO: switch to intersection observer

export default class InfiniteScrollHook {
    constructor(el, handler) {
        this.el = el;
        this.handler = handler;

        this.isTripped = false;
        this.onScroll = this._onScroll.bind(this);
    }

    install() {
        this.el.addEventListener('scroll', this.onScroll);   
    }

    uninstall() {
        this.el.removeEventListener('scroll', this.onScroll);
    }

    _onScroll(e) {
        if (Math.ceil(this.el.scrollTop + this.el.clientHeight + 5) >= this.el.scrollHeight) {
            if (!this.isTripped) {
                this.handler(e);
                this.isTripped = true;
            }
        } else if (this.isTripped) {
            this.isTripped = false;
        }
    }
}