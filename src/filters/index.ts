import currency from 'currency.js';
import { addDays, format, parse } from 'date-fns';
import { startCase as _startCase, upperFirst as _upperFirst } from 'lodash';

import { VfOptions } from '@/config';

import { desnakeCase, formatNumber, formatPhone, formatUSCurrency } from '..';

function bytes(value: number) {
    const p = Math.floor(Math.log(value) / Math.log(1024));
    const numericResult = value / Math.pow(1024, p);
    const stringResult = numericResult.toFixed(2);
    const unit = ['B', 'KB', 'MB', 'GB', 'TB'][p];
    return `${stringResult} ${unit}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dash(value: any) {
    return value !== null && value !== undefined && String(value).length ? value : '-';
}

function dashZeros(value: number | null) {
    return value ? value : '-';
}

function number(value: string | number | null) {
    if (value === null) return value;
    if (typeof value === 'string' && !/^\d+$/.test(value)) return value;
    return formatNumber(Number(value));
}

function phone(value: string | null) {
    if (!value) return value;
    return formatPhone(value);
}

function upperFirst(value: null): null;
function upperFirst(value: string): string;
function upperFirst(value: string | null): null | string {
    return value ? _upperFirst(value) : null;
}

function startCase(value: null): null;
function startCase(value: string): string;
function startCase(value: string | null) {
    return value ? _startCase(value) : null;
}

function upperCase(value: null): null;
function upperCase(value: string): string;
function upperCase(value: string | null) {
    return value ? value.toUpperCase() : null;
}

function upperWords(value: null): null;
function upperWords(value: string): string;
function upperWords(value: string | null) {
    return value ? startCase(value.toLowerCase()) : null;
}

function desnake(value: null): null;
function desnake(value: string): string;
function desnake(value: string | null) {
    return value ? desnakeCase(value) : null;
}

function usCurrency(value: string | number, divisor = 1) {
    return formatUSCurrency(value, divisor);
}

function divide(value: number, divisor: number) {
    return currency(value).divide(divisor).value;
}

function date(value: string | null, formatStr?: string) {
    if (!value) return value;
    return format(new Date(value), formatStr ?? VfOptions.defaultDateFormat);
}

function time(value: string | null, formatStr?: string) {
    if (!value) return value;
    return format(new Date(value), formatStr ?? VfOptions.defaultTimeFormat);
}

function dateTime(value: string | null, formatStr?: string) {
    if (!value) return value;
    return format(new Date(value), formatStr ?? VfOptions.defaultDateFormat);
}

function oneDayForward(date?: string | null) {
    if (!date) return date;
    return format(addDays(parse(date, 'yyyy-MM-dd', new Date()), 1), VfOptions.defaultDateFormat);
}

const FilterFns = {
    bytes,
    dash,
    dashZeros,
    number,
    phone,
    upperFirst,
    startCase,
    upperCase,
    upperWords,
    desnake,
    usCurrency,
    divide,
    date,
    time,
    dateTime,
    oneDayForward
};

// type FilterFn = (value: any, ...unknown: any[]) => any;
export const createFilters = <T>(factory: (baseFilters: typeof FilterFns) => T): typeof FilterFns & T => {
    return {
        ...FilterFns,
        ...factory(FilterFns)
    };
};
