interface IOptions {
    unhandledErrorSupportText: string;
    errorHandler: (err: Error) => void;
}

export const VfOptions: IOptions = {
    unhandledErrorSupportText: 'please contact support',
    errorHandler: err => console.error('Unhandled error:', err)
};

export function configureVf(options: Partial<IOptions>) {
    Object.assign(VfOptions, options);
}
