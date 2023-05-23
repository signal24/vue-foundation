import { v4 as uuidv4 } from 'uuid';

// placing this here so we don't have to use the ESLint rule everywhere
// eslint-disable-next-line vue/prefer-import-from-vue
export { escapeHtml } from '@vue/shared';

export function nl2br(value: string) {
    return value.replace(/\n/g, '<br>');
}

export function desnakeCase(value: string) {
    return value.replace(/_/g, ' ');
}

export function formatPhone(value: string) {
    const cleanValue = value.replace(/\D/g, '').replace(/^1/, '');
    if (cleanValue.length != 10) return value;
    return '(' + cleanValue.substring(0, 3) + ') ' + cleanValue.substring(3, 6) + '-' + cleanValue.substring(6);
}

export function formatUSCurrency(value: string | number) {
    return (
        '$' +
        Number(value)
            .toFixed(3)
            .replace(/0$/, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
}

export function uuid() {
    return uuidv4();
}
