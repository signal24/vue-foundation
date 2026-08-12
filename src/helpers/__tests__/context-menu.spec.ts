import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('positioning', () => {
    // jsdom has no layout, so give menus a fake rendered size.
    const menuSize = { width: 200, height: 300 };
    let originalOffsetWidth: PropertyDescriptor | undefined;
    let originalOffsetHeight: PropertyDescriptor | undefined;

    beforeEach(() => {
        originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
        originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
            configurable: true,
            get(this: HTMLElement) {
                return this.classList.contains('vf-context-menu') ? menuSize.width : 0;
            }
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            get(this: HTMLElement) {
                return this.classList.contains('vf-context-menu') ? menuSize.height : 0;
            }
        });
        window.innerWidth = 1024;
        window.innerHeight = 768;
        menuSize.width = 200;
        menuSize.height = 300;
    });

    afterEach(() => {
        if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
        if (originalOffsetHeight) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    });

    function getMenu() {
        return document.querySelector('.vf-context-menu') as HTMLElement;
    }

    it('opens below-right of the cursor when there is room', () => {
        const { event } = createMouseEvent(100, 100);
        showContextMenu(event, { items: [] });

        expect(getMenu().style.left).toBe('101px');
        expect(getMenu().style.top).toBe('101px');
    });

    it('flips above the cursor when there is no room below but room above', () => {
        const { event } = createMouseEvent(100, 700);
        showContextMenu(event, { items: [] });

        // Bottom edge lands at clientY - 1; top = 699 - 300.
        expect(getMenu().style.top).toBe('399px');
    });

    it('flips left of the cursor when near the right edge', () => {
        const { event } = createMouseEvent(950, 100);
        showContextMenu(event, { items: [] });

        // Right edge lands at clientX - 1; left = 949 - 200.
        expect(getMenu().style.left).toBe('749px');
    });

    it('slides up instead of overflowing when it fits neither side of the cursor', () => {
        menuSize.height = 600;
        const { event } = createMouseEvent(100, 400);
        showContextMenu(event, { items: [] });

        // 768 - 8 margin - 600.
        expect(getMenu().style.top).toBe('160px');
        expect(getMenu().style.maxHeight).toBe('');
    });

    it('pins to the viewport and scrolls when taller than the viewport', () => {
        menuSize.height = 900;
        const { event } = createMouseEvent(100, 400);
        showContextMenu(event, { items: [] });

        expect(getMenu().style.top).toBe('8px');
        expect(getMenu().style.maxHeight).toBe('752px');
        expect(getMenu().style.overflowY).toBe('auto');
    });
});

describe('submenus', () => {
    function menus() {
        return document.querySelectorAll('.vf-context-menu');
    }

    function showWithSubmenu(handler = vi.fn()) {
        const { event } = createMouseEvent();
        showContextMenu(event, {
            items: [
                { title: 'Leaf', handler: vi.fn() },
                { title: 'Parent', items: [{ title: 'Child', handler }] }
            ]
        });
        return document.querySelectorAll('.item')[1] as HTMLElement;
    }

    it('renders a caret on items with children', () => {
        const parentItem = showWithSubmenu();
        expect(parentItem.classList.contains('has-submenu')).toBe(true);
        expect(parentItem.querySelector('.submenu-caret')).not.toBeNull();
    });

    it('opens the submenu on hover and marks the item open', () => {
        const parentItem = showWithSubmenu();
        parentItem.dispatchEvent(new MouseEvent('mouseenter'));

        expect(menus()).toHaveLength(2);
        expect(parentItem.classList.contains('submenu-open')).toBe(true);
    });

    it('opens the submenu on click without closing the menu', () => {
        const parentItem = showWithSubmenu();
        parentItem.click();

        expect(document.querySelector('.vf-overlay')).not.toBeNull();
        expect(menus()).toHaveLength(2);
    });

    it('runs a submenu item handler on click', () => {
        const handler = vi.fn();
        const parentItem = showWithSubmenu(handler);
        parentItem.dispatchEvent(new MouseEvent('mouseenter'));

        const childItem = menus()[1].querySelector('.item') as HTMLElement;
        childItem.click();
        expect(handler).toHaveBeenCalled();
    });

    it('closes the submenu when a sibling item is hovered', () => {
        const parentItem = showWithSubmenu();
        parentItem.dispatchEvent(new MouseEvent('mouseenter'));
        expect(menus()).toHaveLength(2);

        const siblingItem = document.querySelectorAll('.item')[0] as HTMLElement;
        siblingItem.dispatchEvent(new MouseEvent('mouseenter'));
        expect(menus()).toHaveLength(1);
        expect(parentItem.classList.contains('submenu-open')).toBe(false);
    });

    it('closes submenus with the rest of the menu on overlay click', () => {
        const parentItem = showWithSubmenu();
        parentItem.dispatchEvent(new MouseEvent('mouseenter'));

        (document.querySelector('.vf-overlay') as HTMLElement).click();
        expect(menus()).toHaveLength(0);
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
