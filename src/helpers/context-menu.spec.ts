import { afterEach, describe, expect, it, vi } from 'vitest';

import { showContextMenu } from './context-menu';

describe('context-menu helper', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should show context menu', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);

        const handler = vi.fn();
        const event = new MouseEvent('click', {
            clientX: 100,
            clientY: 100,
            bubbles: true
        });
        Object.defineProperty(event, 'currentTarget', { value: target });

        showContextMenu(event, {
            items: [{ title: 'Item 1', handler }]
        });

        const overlay = document.querySelector('.vf-overlay');
        expect(overlay).not.toBeNull();
        const menu = document.querySelector('.vf-context-menu');
        expect(menu).not.toBeNull();

        const item = menu?.querySelector('.item') as HTMLElement;
        expect(item).not.toBeNull();
        // @ts-expect-error innerText exists on HTMLElement in JSDOM but might be missing in some types or behaves differently
        expect(item.innerText).toContain('Item 1');

        item.click();
        expect(handler).toHaveBeenCalled();
    });

    it('should handle confirmation', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);

        const handler = vi.fn();
        const event = new MouseEvent('click', {
            clientX: 100,
            clientY: 100,
            bubbles: true
        });
        Object.defineProperty(event, 'currentTarget', { value: target });

        showContextMenu(event, {
            items: [{ title: 'Delete', handler, shouldConfirm: true }]
        });

        const item = document.querySelector('.item') as HTMLElement;
        expect(item.innerText).toContain('Delete');

        // First click
        item.click();
        expect(handler).not.toHaveBeenCalled();
        expect(item.innerText).toBe('Confirm');
        expect(item.classList.contains('pending-confirm')).toBe(true);

        // Second click
        item.click();
        expect(handler).toHaveBeenCalled();
    });
});
