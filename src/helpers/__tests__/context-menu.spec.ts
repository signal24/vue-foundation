import { afterEach, describe, expect, it, vi } from 'vitest';

import { showContextMenu } from '../context-menu';

function createMouseEvent(x = 100, y = 100) {
    const target = document.createElement('div');
    document.body.appendChild(target);

    const event = new MouseEvent('click', { clientX: x, clientY: y, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: target });
    return { event, target };
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('showContextMenu', () => {
    it('creates overlay and menu elements', () => {
        const { event } = createMouseEvent();
        showContextMenu(event, { items: [{ title: 'Item 1', handler: vi.fn() }] });

        expect(document.querySelector('.vf-overlay')).not.toBeNull();
        expect(document.querySelector('.vf-context-menu')).not.toBeNull();
    });

    it('renders menu items', () => {
        const { event } = createMouseEvent();
        showContextMenu(event, {
            items: [
                { title: 'Edit', handler: vi.fn() },
                { title: 'Delete', handler: vi.fn() }
            ]
        });

        const items = document.querySelectorAll('.item');
        expect(items).toHaveLength(2);
        expect((items[0] as HTMLElement).innerText).toBe('Edit');
        expect((items[1] as HTMLElement).innerText).toBe('Delete');
    });

    it('renders separators', () => {
        const { event } = createMouseEvent();
        showContextMenu(event, {
            items: [{ title: 'A', handler: vi.fn() }, '-', { title: 'B', handler: vi.fn() }]
        });

        expect(document.querySelector('.separator')).not.toBeNull();
        expect(document.querySelectorAll('.item')).toHaveLength(2);
    });

    it('calls handler on item click', () => {
        const handler = vi.fn();
        const { event } = createMouseEvent();
        showContextMenu(event, { items: [{ title: 'Click Me', handler }] });

        const item = document.querySelector('.item') as HTMLElement;
        item.click();
        expect(handler).toHaveBeenCalled();
    });

    it('adds target classes', () => {
        const { event, target } = createMouseEvent();
        showContextMenu(event, { targetClass: 'custom', items: [] });

        expect(target.classList.contains('context-menu-active')).toBe(true);
        expect(target.classList.contains('custom')).toBe(true);
    });

    it('adds menu class', () => {
        const { event } = createMouseEvent();
        showContextMenu(event, { class: 'my-menu', items: [] });

        const menu = document.querySelector('.vf-context-menu') as HTMLElement;
        expect(menu.classList.contains('my-menu')).toBe(true);
    });

    it('closes menu on overlay click', () => {
        const { event, target } = createMouseEvent();
        showContextMenu(event, { targetClass: 'custom', items: [] });

        const overlay = document.querySelector('.vf-overlay') as HTMLElement;
        overlay.click();

        expect(document.querySelector('.vf-overlay')).toBeNull();
        expect(target.classList.contains('context-menu-active')).toBe(false);
        expect(target.classList.contains('custom')).toBe(false);
    });
});

describe('confirmation flow', () => {
    it('requires two clicks for confirm items', () => {
        const handler = vi.fn();
        const { event } = createMouseEvent();
        showContextMenu(event, {
            items: [{ title: 'Delete', handler, shouldConfirm: true }]
        });

        const item = document.querySelector('.item') as HTMLElement;

        item.click();
        expect(handler).not.toHaveBeenCalled();
        expect(item.classList.contains('pending-confirm')).toBe(true);
        expect(item.innerText).toBe('Confirm');

        item.click();
        expect(handler).toHaveBeenCalled();
    });

    it('resets on mouseleave', () => {
        const handler = vi.fn();
        const { event } = createMouseEvent();
        showContextMenu(event, {
            items: [{ title: 'Delete', handler, shouldConfirm: true }]
        });

        const item = document.querySelector('.item') as HTMLElement;
        item.click();
        expect(item.innerText).toBe('Confirm');

        item.dispatchEvent(new MouseEvent('mouseleave'));
        expect(item.classList.contains('pending-confirm')).toBe(false);
        expect(item.innerText).toBe('Delete');
    });
});
