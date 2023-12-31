interface IOptions {
    unhandledErrorSupportText: string;
    errorHandler: (err: Error) => void;
    defaultDateFormat: string;
    defaultDateTimeFormat: string;
}

export const VfOptions: IOptions = {
    unhandledErrorSupportText: 'please contact support',
    errorHandler: err => console.error('Unhandled error:', err),
    defaultDateFormat: 'M/d/yy',
    defaultDateTimeFormat: 'M/d/yy H:mm'
};

export function configureVf(options: Partial<IOptions>) {
    Object.assign(VfOptions, options);
}
