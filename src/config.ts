interface IOptions {
    unhandledErrorSupportText: string;
    errorHandler: (err: Error) => void;
    defaultDateFormat: string;
    defaultTimeFormat: string;
    defaultCurrencyDivisor: number;
}

export const VfOptions: IOptions = {
    unhandledErrorSupportText: 'please contact support',
    errorHandler: err => console.error('Unhandled error:', err),
    defaultDateFormat: 'M/d/yy',
    defaultTimeFormat: 'H:mm',
    defaultCurrencyDivisor: 1
};

export function configureVf(options: Partial<IOptions>) {
    Object.assign(VfOptions, options);
}
