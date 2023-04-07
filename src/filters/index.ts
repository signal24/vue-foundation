import { startCase, upperFirst } from 'lodash';

import { desnakeCase, formatNumber, formatPhone, formatUSCurrency } from '..';

const FilterFns = {
    bytes(value: number) {
        const p = Math.floor(Math.log(value) / Math.log(1024));
        const numericResult = value / Math.pow(1024, p);
        const stringResult = numericResult.toFixed(2);
        const unit = ['B', 'KB', 'MB', 'GB', 'TB'][p];
        return `${stringResult} ${unit}`;
    },

    dash(value: any) {
        return value !== null && value !== undefined && String(value).length ? value : '-';
    },

    dashZeros(value: number | null) {
        return value ? value : '-';
    },

    lowercase(value: string | null) {
        return value ? value.toLowerCase() : null;
    },

    number(value: string | number | null) {
        if (value === null) return value;
        if (typeof value === 'string' && !/^\d+$/.test(value)) return value;
        return formatNumber(Number(value));
    },

    phone(value: string | null) {
        if (!value) return value;
        return formatPhone(value);
    },

    upperFirst(value: string | null) {
        return value ? upperFirst(value) : null;
    },

    startCase(value: string | null) {
        return value ? startCase(value) : null;
    },

    upperCase(value: string | null) {
        return value ? value.toUpperCase() : null;
    },

    desnake(value: string | null) {
        return value ? desnakeCase(value) : null;
    },

    usCurrency(value: string | number) {
        return formatUSCurrency(value);
    }
};

type FilterFn = (value: any, ...unknown: any[]) => any;
export const createFilters = (filters?: Record<string, FilterFn>) => {
    return {
        ...FilterFns,
        ...filters
    };
};
