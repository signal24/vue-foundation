import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { vAutofocus } from '../../directives/autofocus';
import { showAlert, showConfirm, showConfirmDestroy, showMutableWait, showWait } from '../alert-helpers';
import { OverlayContainer } from '../overlay-container';

function mountOverlayContainer() {
    document.body.innerHTML = '';
    return mount(OverlayContainer, {
        global: {
            directives: { autofocus: vAutofocus }
        },
        attachTo: document.body
    });
}

describe('showAlert', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('shows an alert with message', async () => {
        mountOverlayContainer();
        const alertPromise = showAlert('Hello world');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.vf-alert')).toBeTruthy();
        expect(target.textContent).toContain('Hello world');

        const okBtn = target.querySelector('button');
        okBtn?.click();
        await alertPromise;
    });

    it('shows an alert with title and message', async () => {
        mountOverlayContainer();
        const alertPromise = showAlert('My Title', 'Alert body');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.textContent).toContain('My Title');
        expect(target.textContent).toContain('Alert body');

        target.querySelector('button')?.click();
        await alertPromise;
    });

    it('resolves when OK is clicked', async () => {
        mountOverlayContainer();
        const alertPromise = showAlert('Test');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        target.querySelector('button')?.click();

        await expect(alertPromise).resolves.toBeUndefined();
    });
});

describe('showConfirm', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('returns true when Confirm is clicked', async () => {
        mountOverlayContainer();
        const confirmPromise = showConfirm('Are you sure?');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        const buttons = target.querySelectorAll('button');
        expect(buttons[0]?.textContent).toBe('Confirm');

        buttons[0]?.click();
        await expect(confirmPromise).resolves.toBe(true);
    });

    it('returns false when Cancel is clicked', async () => {
        mountOverlayContainer();
        const confirmPromise = showConfirm('Are you sure?');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        const buttons = target.querySelectorAll('button');
        expect(buttons[1]?.textContent).toBe('Cancel');

        buttons[1]?.click();
        await expect(confirmPromise).resolves.toBe(false);
    });

    it('accepts title and message', async () => {
        mountOverlayContainer();
        const confirmPromise = showConfirm('Warning', 'Continue?');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.textContent).toContain('Warning');
        expect(target.textContent).toContain('Continue?');

        target.querySelectorAll('button')[0]?.click();
        await confirmPromise;
    });
});

describe('showConfirmDestroy', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('applies destructive class', async () => {
        mountOverlayContainer();
        const confirmPromise = showConfirmDestroy('Delete this?');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.destructive')).toBeTruthy();

        target.querySelectorAll('button')[0]?.click();
        await confirmPromise;
    });
});

describe('showWait', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('shows a wait overlay with no footer', async () => {
        mountOverlayContainer();
        const dismiss = showWait('Please wait...');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.wait')).toBeTruthy();
        expect(target.textContent).toContain('Please wait...');
        expect(target.querySelectorAll('button')).toHaveLength(0);

        dismiss();
    });

    it('removes overlay when dismiss is called', async () => {
        mountOverlayContainer();
        const dismiss = showWait('Loading...');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.wait')).toBeTruthy();

        dismiss();
        await vi.dynamicImportSettled();
        expect(target.querySelector('.wait')).toBeFalsy();
    });
});

describe('showMutableWait', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('returns update and dismiss functions', () => {
        mountOverlayContainer();
        const wait = showMutableWait('Initial message');
        expect(typeof wait.update).toBe('function');
        expect(typeof wait.dismiss).toBe('function');
        wait.dismiss();
    });

    it('dismisses the overlay', async () => {
        mountOverlayContainer();
        const wait = showMutableWait('Loading...');

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.wait')).toBeTruthy();

        wait.dismiss();
        await vi.dynamicImportSettled();
        expect(target.querySelector('.wait')).toBeFalsy();
    });
});
