import { UserError } from './error';

interface IRequestOptions {
    readonly method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    readonly url: string;
    readonly path?: Record<string, any>;
    readonly cookies?: Record<string, any>;
    readonly headers?: Record<string, any>;
    readonly query?: Record<string, any>;
    readonly formData?: Record<string, any>;
    readonly body?: any;
    readonly mediaType?: string;
    readonly responseHeader?: string;
    readonly errors?: Record<number, string>;
}

interface IBaseHttpRequest {
    request<T>(options: IRequestOptions): ICancelablePromise<T>;
}

interface IApiClient {
    request: IBaseHttpRequest;
}

interface IApiError extends Error {
    status: number;
    statusText: string;
    body: any;
}

declare class ICancelablePromise<T = any> {
    constructor(executor: (resolve: (value: any) => void, reject: (reason: any) => void, onCancel: (cancel: () => void) => void) => void);
    then<TResult1 = any, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
    cancel(): void;
}

interface IWrappedApiClientOptions<P extends ICancelablePromise = ICancelablePromise, Arguments extends unknown[] = any[]> {
    apiClient: IApiClient;
    onRequest?: (options: IRequestOptions) => IRequestOptions;
    onError?: (err: Error, options: IRequestOptions) => boolean | void;
    CancelablePromise: new (...arguments_: Arguments) => P;
}

function isApiError(err: any): err is IApiError {
    return err instanceof Error && 'status' in err && 'body' in err;
}

export function installApiClientInterceptors({ apiClient, onRequest, onError, CancelablePromise }: IWrappedApiClientOptions) {
    const originalRequest = apiClient.request.request.bind(apiClient.request);
    apiClient.request.request = (options: IRequestOptions) => {
        if (onRequest) {
            options = onRequest(options);
        }

        return new CancelablePromise((resolve: (value: any) => void, reject: (err: any) => void, onCancel: (handler: () => void) => void) => {
            const promise = originalRequest(options);
            onCancel(promise.cancel);
            promise.then(resolve).catch(err => {
                if (isApiError(err) && err.status === 422 && typeof err.body === 'object' && 'error' in err.body) {
                    return reject(new UserError(err.body.error));
                }
                if (onError && onError(err, options)) {
                    return;
                }
                reject(err);
            });
        });
    };
}