interface IOptions {
    unhandledErrorSupportText: string;
    errorHandler: (err: Error) => void;
    defaultDateTimeFormat: string;
}

export const VfOptions: IOptions = {
    unhandledErrorSupportText: 'please contact support',
    errorHandler: err => console.error('Unhandled error:', err),
    defaultDateTimeFormat: 'MM/dd/yy HH:mm'
};

export function configureVf(options: Partial<IOptions>) {
    Object.assign(VfOptions, options);
}
