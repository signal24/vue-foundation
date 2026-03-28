import { mount } from '@vue/test-utils';
import { format } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { VfOptions } from '../../config';
import { vDatetime } from '../datetime';

function mountDatetime(template: string, data: () => Record<string, unknown>) {
    return mount(
        defineComponent({
            directives: { datetime: vDatetime },
            template,
            data
        }),
        { attachTo: document.body }
    );
}

describe('v-datetime', () => {
    it('formats with default date+time format', () => {
        const date = new Date('2024-06-15T14:30:00Z');
        const wrapper = mountDatetime('<span v-datetime="dt"></span>', () => ({ dt: date.toISOString() }));
        const expected = format(date, `${VfOptions.defaultDateFormat} ${VfOptions.defaultTimeFormat}`);
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });

    it('formats date-only with date-only attribute', () => {
        const date = new Date('2024-06-15T14:30:00Z');
        const wrapper = mountDatetime('<span v-datetime="dt" date-only></span>', () => ({ dt: date.toISOString() }));
        const expected = format(date, VfOptions.defaultDateFormat);
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });

    it('shows placeholder when value is falsy', () => {
        const wrapper = mountDatetime('<span v-datetime="dt" placeholder="N/A"></span>', () => ({ dt: '' }));
        expect(wrapper.find('span').element.innerText).toBe('N/A');
    });

    it('shows empty string when value is falsy with no placeholder', () => {
        const wrapper = mountDatetime('<span v-datetime="dt"></span>', () => ({ dt: '' }));
        expect(wrapper.find('span').element.innerText).toBe('');
    });

    it('uses custom format attribute', () => {
        const date = new Date('2024-06-15T14:30:00Z');
        const wrapper = mountDatetime('<span v-datetime="dt" format="yyyy-MM-dd"></span>', () => ({
            dt: date.toISOString()
        }));
        const expected = format(date, 'yyyy-MM-dd');
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });

    it('shows time-only for same-day dates with relative-date', () => {
        const now = new Date();
        now.setHours(10, 30, 0, 0);
        const wrapper = mountDatetime('<span v-datetime="dt" relative-date></span>', () => ({
            dt: now.toISOString()
        }));
        const expected = 'at ' + format(now, 'HH:mm');
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });

    it('shows simplified-date with M/d for same year', () => {
        const now = new Date();
        // Use a date in the same year but guaranteed different day (6 months offset)
        const offsetMonth = (now.getMonth() + 6) % 12;
        const sameYear = new Date(now.getFullYear(), offsetMonth, 15, 10, 30, 0);
        const wrapper = mountDatetime('<span v-datetime="dt" simplified-date></span>', () => ({
            dt: sameYear.toISOString()
        }));
        const expected = format(sameYear, `M/d ${VfOptions.defaultTimeFormat}`);
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });

    it('shows simplified-date with M/d/yy for different year', () => {
        const pastYear = new Date(2020, 5, 15, 10, 30, 0);
        const wrapper = mountDatetime('<span v-datetime="dt" simplified-date></span>', () => ({
            dt: pastYear.toISOString()
        }));
        const expected = format(pastYear, `M/d/yy ${VfOptions.defaultTimeFormat}`);
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });

    it('shows simplified-date date-only omits time', () => {
        const pastYear = new Date(2020, 5, 15, 10, 30, 0);
        const wrapper = mountDatetime('<span v-datetime="dt" simplified-date date-only></span>', () => ({
            dt: pastYear.toISOString()
        }));
        const expected = format(pastYear, 'M/d/yy');
        expect(wrapper.find('span').element.innerText).toBe(expected);
    });
});
