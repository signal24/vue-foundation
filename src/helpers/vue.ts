export function isPropTruthy(value: any) {
    return value !== undefined && (value === '' || value);
}
