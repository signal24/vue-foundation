export function nl2br(value: string) {
    return value.replace(/\n/g, '<br>');
}

export function desnakeCase(value: string) {
    return value.replace(/_/g, ' ');
}

export function formatPhone(value: string) {
    const cleanValue = value.replace(/[^\d]/g, '').replace(/^1/, '');
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
