import { format } from 'date-fns';
import type { ObjectDirective } from 'vue';

export const vDateInput: ObjectDirective<HTMLInputElement, void> = {
    beforeMount: fn
};

function fn(el: HTMLInputElement) {
    el.addEventListener('blur', () => {
        let val = el.value;
        if (/^\d{1,2}\/\d{1,2}$/.test(val)) val += '/' + format(new Date(), 'yy');

        const ts = Date.parse(val);
        if (isNaN(ts)) el.value = '';
        else el.value = format(ts, 'MM/dd/yyyy');

        el.dispatchEvent(new Event('input'));
    });
}
