import { afterEach, describe, expect, it } from 'vitest';

import { maskEl, maskForm, unmaskEl, unmaskForm } from './mask';

describe('mask helper', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('maskEl', () => {
        it('should mask element with message', () => {
            const el = document.createElement('div');
            document.body.appendChild(el);

            maskEl(el, 'Loading...');

            const mask = el.querySelector('.vf-mask') as HTMLElement;
            expect(mask).not.toBeNull();
            expect(mask.textContent).toBe('Loading...');
        });

        it('should unmask element', () => {
            const el = document.createElement('div');
            document.body.appendChild(el);

            maskEl(el, 'Loading...');
            expect(el.querySelector('.vf-mask')).not.toBeNull();

            unmaskEl(el);
            expect(el.querySelector('.vf-mask')).toBeNull();
        });
    });

    describe('maskForm', () => {
        it('should mask form and disable inputs', () => {
            const form = document.createElement('form');
            form.innerHTML = `
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            `;
            document.body.appendChild(form);

            const buttonEl = form.querySelectorAll('button:not([disabled]):not([type="button"])')[0];
            expect(buttonEl).toBeDefined();

            maskForm(form);

            expect(form.classList.contains('vf-masked')).toBe(true);
            const input = form.querySelector('input');
            const button = form.querySelector('button');

            expect(input?.hasAttribute('disabled')).toBe(true);
            expect(button?.hasAttribute('disabled')).toBe(true);
            // unmaskForm uses innerHTML to restore, so innerText might not be available in JSDOM
            // However here we check the text during masking
            // Use textContent to be safe with JSDOM
            expect(button?.textContent).toBe('Please wait...');
        });

        it('should unmask form', () => {
            const form = document.createElement('form');
            form.innerHTML = `
                <input type="text" name="name" />
                <button type="submit">Submit</button>
            `;
            document.body.appendChild(form);

            const buttonEl = form.querySelectorAll('button:not([disabled]):not([type="button"])')[0];
            expect(buttonEl).toBeDefined();

            maskForm(form);
            unmaskForm(form);

            expect(form.classList.contains('vf-masked')).toBe(false);
            const input = form.querySelector('input');
            const button = form.querySelector('button');

            expect(input?.hasAttribute('disabled')).toBe(false);
            expect(button?.hasAttribute('disabled')).toBe(false);
            // unmaskForm uses innerHTML to restore, so innerText might not be available in JSDOM
            expect(button?.innerHTML).toBe('Submit');
        });
    });
});
