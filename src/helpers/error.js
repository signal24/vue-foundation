import app from '../app';
import vfConfig from '../config'

app.config.globalProperties.$reportError = err => {
    if (!(err instanceof Error)) {
        err = new Error(err);
    }

    if (vfConfig.reportErrorHandler) {
        vfConfig.reportErrorHandler(err);
    }

    else {
        console.error(err);
    }
}

app.config.globalProperties.$throwUserError = msg => {
    let err = new Error(msg);
    err.code = 'USERERR';
    throw err;
};

Object.defineProperty(Error.prototype, 'userMessage', {
    get() {
        if (this.code == 'USERERR')
            return this.message;
        else
            return `An application error has occurred:\n\n${this.message}\n\nPlease refresh the page and try again. If this error persists, ${vfConfig.unhandledErrorSupportText}.`;
    }
});

Error.prototype.handle = function() {
    if (this.code != 'USERERR') {
        app.config.globalProperties.$reportError(this);
    }

    return this;
};