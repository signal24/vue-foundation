import { afterEach, describe, expect, it } from 'vitest';

import { maskEl, maskForm, unmaskEl, unmaskForm } from '../mask';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('maskEl', () => {
    it('creates a mask overlay inside the element', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        maskEl(el, 'Loading...');

        const mask = el.querySelector('.vf-mask') as HTMLElement;
        expect(mask).not.toBeNull();
        expect(mask.innerText).toBe('Loading...');
    });

    it('defaults to empty message', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        maskEl(el);

        const mask = el.querySelector('.vf-mask') as HTMLElement;
        expect(mask.innerText).toBe('');
    });

    it('updates message on re-mask', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        maskEl(el, 'First');
        maskEl(el, 'Second');

        const masks = el.querySelectorAll('.vf-mask');
        expect(masks).toHaveLength(1);
        expect((masks[0] as HTMLElement).innerText).toBe('Second');
    });

    it('returns an unmask function', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const unmask = maskEl(el, 'test');

        expect(el.querySelector('.vf-mask')).not.toBeNull();
        unmask();
        expect(el.querySelector('.vf-mask')).toBeNull();
    });
});

describe('unmaskEl', () => {
    it('removes the mask overlay', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        maskEl(el);

        unmaskEl(el);
        expect(el.querySelector('.vf-mask')).toBeNull();
    });

    it('is a no-op if not masked', () => {
        const el = document.createElement('div');
        expect(() => unmaskEl(el)).not.toThrow();
    });
});

describe('maskForm', () => {
    function createForm() {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" name="name" />
            <textarea name="notes"></textarea>
            <select name="type"><option>A</option></select>
            <button type="submit">Save</button>
            <button type="button">Cancel</button>
        `;
        document.body.appendChild(form);
        return form;
    }

    it('adds vf-masked class to form', () => {
        const form = createForm();
        maskForm(form);
        expect(form.classList.contains('vf-masked')).toBe(true);
    });

    it('disables all inputs, selects, and textareas', () => {
        const form = createForm();
        maskForm(form);

        expect(form.querySelector('input')!.hasAttribute('disabled')).toBe(true);
        expect(form.querySelector('textarea')!.hasAttribute('disabled')).toBe(true);
        expect(form.querySelector('select')!.hasAttribute('disabled')).toBe(true);
    });

    it('changes submit button text to "Please wait..."', () => {
        const form = createForm();
        maskForm(form);

        const submitBtn = form.querySelector('button[type="submit"]') as HTMLElement;
        expect(submitBtn.innerText).toBe('Please wait...');
        expect(submitBtn.hasAttribute('disabled')).toBe(true);
    });

    it('accepts custom button text', () => {
        const form = createForm();
        maskForm(form, undefined, 'Saving...');

        const submitBtn = form.querySelector('button[type="submit"]') as HTMLElement;
        expect(submitBtn.innerText).toBe('Saving...');
    });

    it('returns an unmask function', () => {
        const form = createForm();
        const unmask = maskForm(form);

        unmask();
        expect(form.classList.contains('vf-masked')).toBe(false);
        expect(form.querySelector('input')!.hasAttribute('disabled')).toBe(false);
    });
});

describe('unmaskForm', () => {
    it('restores form to original state', () => {
        const form = document.createElement('form');
        form.innerHTML = '<input type="text" /><button type="submit">Save</button>';
        document.body.appendChild(form);

        maskForm(form);
        unmaskForm(form);

        expect(form.classList.contains('vf-masked')).toBe(false);
        expect(form.querySelector('input')!.hasAttribute('disabled')).toBe(false);
        const btn = form.querySelector('button') as HTMLElement;
        expect(btn.hasAttribute('disabled')).toBe(false);
        expect(btn.innerHTML).toBe('Save');
    });

    it('is a no-op if form was not masked', () => {
        const form = document.createElement('form');
        expect(() => unmaskForm(form)).not.toThrow();
    });
});
