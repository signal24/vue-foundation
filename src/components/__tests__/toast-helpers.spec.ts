import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OverlayContainer } from '../overlay-container';
import { showToast } from '../toast-helpers';

function mountOverlayContainer() {
    document.body.innerHTML = '';
    return mount(OverlayContainer, { attachTo: document.body });
}

describe('showToast', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('shows a toast with message', async () => {
        mountOverlayContainer();
        const dismiss = showToast({ message: 'Saved!' });

        await flushPromises();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.textContent).toContain('Saved!');

        dismiss();
    });

    it('returns dismiss function that removes the toast', async () => {
        mountOverlayContainer();
        const dismiss = showToast({ message: 'Test', durationSecs: null });

        await flushPromises();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.vf-toast')).toBeTruthy();

        dismiss();
        await flushPromises();
        expect(target.querySelector('.vf-toast')).toBeFalsy();
    });

    it('auto-dismisses after duration', async () => {
        vi.useFakeTimers();
        mountOverlayContainer();
        showToast({ message: 'Bye!', durationSecs: 2 });

        await flushPromises();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.vf-toast')).toBeTruthy();

        vi.advanceTimersByTime(2000);
        await flushPromises();
        expect(target.querySelector('.vf-toast')).toBeFalsy();
    });
});
