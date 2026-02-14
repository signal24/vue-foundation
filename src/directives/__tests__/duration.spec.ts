import { mount } from '@vue/test-utils';
import { defineComponent, type Directive } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Use dynamic import to isolate module-level state (setInterval, durationEls array)
async function importDuration() {
    const mod = await import('../duration');
    return mod.vDuration;
}

function mountDuration(vDuration: Directive, template: string, data: () => Record<string, unknown>) {
    return mount(
        defineComponent({
            directives: { duration: vDuration },
            template,
            data
        }),
        { attachTo: document.body }
    );
}

describe('v-duration', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('shows elapsed time', async () => {
        vi.useFakeTimers();
        const vDuration = await importDuration();
        const startTime = Date.now() - 65000; // 1m 5s ago

        const wrapper = mountDuration(vDuration, `<span v-duration="ts"></span>`, () => ({ ts: startTime }));
        expect(wrapper.find('span').element.innerText).toBe('1m 5s');
    });

    it('updates on interval tick', async () => {
        vi.useFakeTimers();
        const vDuration = await importDuration();
        const startTime = Date.now() - 60000;

        const wrapper = mountDuration(vDuration, `<span v-duration="ts"></span>`, () => ({ ts: startTime }));
        expect(wrapper.find('span').element.innerText).toBe('1m 0s');

        vi.advanceTimersByTime(1000);
        expect(wrapper.find('span').element.innerText).toBe('1m 1s');
    });

    it('shows dash when value is falsy', async () => {
        const vDuration = await importDuration();

        const wrapper = mountDuration(vDuration, `<span v-duration="ts"></span>`, () => ({ ts: 0 }));
        expect(wrapper.find('span').element.innerText).toBe('-');
    });

    it('respects no-seconds attribute', async () => {
        vi.useFakeTimers();
        const vDuration = await importDuration();
        const startTime = Date.now() - 65000;

        const wrapper = mountDuration(vDuration, `<span v-duration="ts" no-seconds></span>`, () => ({ ts: startTime }));
        expect(wrapper.find('span').element.innerText).toBe('1m');
    });
});

describe('secondsToString (via duration display)', () => {
    it('formats days, hours, minutes, seconds', async () => {
        vi.useFakeTimers();
        const vDuration = await importDuration();
        const startTime = Date.now() - 93784000; // 1d 2h 3m 4s

        const wrapper = mountDuration(vDuration, `<span v-duration="ts"></span>`, () => ({ ts: startTime }));
        expect(wrapper.find('span').element.innerText).toBe('1d 2h 3m 4s');
    });

    it('shows 0m when less than a minute with no-seconds', async () => {
        vi.useFakeTimers();
        const vDuration = await importDuration();
        const startTime = Date.now() - 30000; // 30s

        const wrapper = mountDuration(vDuration, `<span v-duration="ts" no-seconds></span>`, () => ({ ts: startTime }));
        expect(wrapper.find('span').element.innerText).toBe('0m');
    });
});
