let options = {
    unhandledErrorSupportText: 'please contact support'
};

function applyConfiguration(inOptions) {
    Object.assign(options, inOptions);
}

Object.defineProperty(options, 'set', { value: applyConfiguration, enumerable: false });

export default options;