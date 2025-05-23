export interface VfSmartSelectOptionDescriptor<T> {
    key: string | symbol;
    group?: string;
    title: string;
    subtitle?: string | null;
    searchContent?: string;
    ref?: T;
}
