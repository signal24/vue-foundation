import Vue from 'vue'
import Config from '../config'

Vue.prototype.$reportError = err => {
    if (!(err instanceof Error)) {
        err = new Error(err);
    }

    if (Config.reportErrorHandler) {
        Config.reportErrorHandler(err);
    }

    else {
        console.error(err);
    }
}

Object.defineProperty(Error.prototype, 'userMessage', {
    get() {
        if (this.code == 'USERERR')
            return this.message;
        else
            return `An application error has occurred:\n\n${this.message}\n\nPlease refresh the page and try again. If this error persists, ${Config.unhandledErrorSupportText}.`;
    }
});

Error.prototype.handle = function() {
    if (this.code != 'USERERR') {
        Vue.prototype.$reportError(this);
    }

    return this;
};