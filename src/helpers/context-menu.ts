export interface ContextMenuItem {
    title: string;
    /** Runs when the item is clicked. Ignored when `items` is set. */
    handler?: () => void;
    class?: string;
    shouldConfirm?: boolean;
    /** Child items — the item opens a submenu on hover/click instead of running a handler. */
    items?: (ContextMenuItem | '-')[];
}

export interface ContextMenuConfig {
    targetClass?: string;
    class?: string;
    items: (ContextMenuItem | '-')[];
}

interface MenuHandle {
    el: HTMLElement;
    close: () => void;
}

/** Minimum gap between any menu edge and the viewport. */
const VIEWPORT_MARGIN = 8;
/** Submenus overlap their parent menu slightly so the hover path stays unbroken. */
const SUBMENU_OVERLAP = 2;

export function showContextMenu(e: MouseEvent, config: ContextMenuConfig) {
    globalThis.getSelection()?.removeAllRanges();

    const wrapperEl = document.createElement('div');
    wrapperEl.classList.add('vf-overlay');
    wrapperEl.addEventListener('click', closeMenu);
    wrapperEl.addEventListener('contextmenu', e => e.preventDefault());
    document.body.appendChild(wrapperEl);

    const target = e.currentTarget as HTMLElement;
    target.classList.add('context-menu-active');

    if (config.targetClass) {
        target.classList.add(config.targetClass);
    }

    const rootMenu = buildMenu(config.items);
    wrapperEl.appendChild(rootMenu.el);

    // Rightward/downward from the cursor by preference, flipping to the other
    // side of it when out of room; a menu too tall for either side pins to the
    // viewport and scrolls.
    placeHorizontally(rootMenu.el, e.clientX + 1, e.clientX - 1);
    placeVertically(rootMenu.el, e.clientY + 1, e.clientY - 1);
    freezeWidth(rootMenu.el);

    function buildMenu(items: (ContextMenuItem | '-')[]): MenuHandle {
        const menuEl = document.createElement('div');
        menuEl.classList.add('vf-context-menu');
        menuEl.style.position = 'absolute';

        if (config.class) {
            menuEl.classList.add(config.class);
        }

        // At most one submenu is open per menu; hovering anything else in this
        // menu closes it (and, recursively, its descendants).
        let openChild: { itemEl: HTMLElement; handle: MenuHandle } | null = null;

        const closeChild = () => {
            if (!openChild) return;
            openChild.handle.close();
            openChild.itemEl.classList.remove('submenu-open');
            openChild = null;
        };

        items.forEach(item => {
            if (item == '-') {
                const separatorEl = document.createElement('div');
                separatorEl.classList.add('separator');
                separatorEl.addEventListener('mouseenter', closeChild);
                menuEl.appendChild(separatorEl);
                return;
            }

            const itemEl = document.createElement('div');
            itemEl.classList.add('item');
            itemEl.style.userSelect = 'none';
            itemEl.innerText = item.title;
            menuEl.appendChild(itemEl);

            if (item.class) {
                itemEl.classList.add(item.class);
            }

            if (item.items?.length) {
                itemEl.classList.add('has-submenu');

                const caretEl = document.createElement('span');
                caretEl.classList.add('submenu-caret');
                caretEl.innerText = '›';
                caretEl.style.marginLeft = 'auto';
                caretEl.style.paddingLeft = '12px';
                itemEl.appendChild(caretEl);

                const openSubmenu = () => {
                    if (openChild?.itemEl === itemEl) return;
                    closeChild();
                    const handle = buildMenu(item.items!);
                    // Submenus attach to the overlay, not the parent menu — a
                    // scrolling parent would otherwise clip them.
                    wrapperEl.appendChild(handle.el);
                    positionSubmenu(handle.el, itemEl, menuEl);
                    freezeWidth(handle.el);
                    itemEl.classList.add('submenu-open');
                    openChild = { itemEl, handle };
                };

                itemEl.addEventListener('mouseenter', openSubmenu);
                itemEl.addEventListener('click', e => {
                    // Parents only reveal their children; the menu stays open.
                    e.stopPropagation();
                    openSubmenu();
                });
                return;
            }

            itemEl.addEventListener('mouseenter', closeChild);

            if (item.shouldConfirm) {
                itemEl.addEventListener('click', e => confirmAction(e, itemEl, () => item.handler?.()));
            } else {
                itemEl.addEventListener('click', () => item.handler?.());
            }
        });

        return {
            el: menuEl,
            close: () => {
                closeChild();
                menuEl.remove();
            }
        };
    }

    function positionSubmenu(menuEl: HTMLElement, itemEl: HTMLElement, parentMenuEl: HTMLElement) {
        const itemRect = itemEl.getBoundingClientRect();
        const parentRect = parentMenuEl.getBoundingClientRect();
        // Cancel the menu's own padding so its first item lines up with the parent item.
        const paddingTop = parseFloat(getComputedStyle(menuEl).paddingTop) || 0;
        placeHorizontally(menuEl, parentRect.right - SUBMENU_OVERLAP, parentRect.left + SUBMENU_OVERLAP);
        placeVertically(menuEl, itemRect.top - paddingTop, itemRect.bottom + paddingTop);
    }

    function closeMenu() {
        if (config.targetClass) {
            target.classList.remove(config.targetClass);
        }

        target.classList.remove('context-menu-active');

        wrapperEl.remove();
    }

    function confirmAction(e: MouseEvent, itemEl: HTMLElement, handler: () => void) {
        if (itemEl.classList.contains('pending-confirm')) {
            return handler();
        }

        const originalContent = itemEl.innerHTML;
        itemEl.classList.add('pending-confirm');
        itemEl.innerText = 'Confirm';

        const onMouseLeave = () => {
            itemEl.classList.remove('pending-confirm');
            itemEl.innerHTML = originalContent;
            itemEl.removeEventListener('mouseleave', onMouseLeave);
        };

        itemEl.addEventListener('mouseleave', onMouseLeave);
        e.stopPropagation();
    }
}

/**
 * Places the menu with its left edge at preferredLeft. When it would overflow
 * the right of the viewport, its right edge flips to flippedRight instead (the
 * other side of the cursor or parent menu); either way the result is clamped
 * inside the viewport.
 */
function placeHorizontally(menuEl: HTMLElement, preferredLeft: number, flippedRight: number) {
    const viewportWidth = window.innerWidth;
    const menuWidth = menuEl.offsetWidth;

    let left = preferredLeft;
    if (left + menuWidth > viewportWidth - VIEWPORT_MARGIN && flippedRight - menuWidth >= VIEWPORT_MARGIN) {
        left = flippedRight - menuWidth;
    }
    left = Math.min(left, viewportWidth - VIEWPORT_MARGIN - menuWidth);
    left = Math.max(left, VIEWPORT_MARGIN);

    menuEl.style.left = left + 'px';
}

/**
 * Places the menu with its top edge at preferredTop. When it would overflow the
 * bottom of the viewport, its bottom edge flips to flippedBottom if the menu
 * fits above; otherwise it slides up as far as needed, and a menu taller than
 * the viewport itself pins to the top margin and scrolls internally.
 */
function placeVertically(menuEl: HTMLElement, preferredTop: number, flippedBottom: number) {
    const viewportHeight = window.innerHeight;
    const menuHeight = menuEl.offsetHeight;

    let top = preferredTop;
    if (top + menuHeight > viewportHeight - VIEWPORT_MARGIN) {
        if (flippedBottom - menuHeight >= VIEWPORT_MARGIN) {
            top = flippedBottom - menuHeight;
        } else {
            top = viewportHeight - VIEWPORT_MARGIN - menuHeight;
        }
    }
    if (top < VIEWPORT_MARGIN) {
        top = VIEWPORT_MARGIN;
        menuEl.style.maxHeight = viewportHeight - VIEWPORT_MARGIN * 2 + 'px';
        menuEl.style.overflowY = 'auto';
    }

    menuEl.style.top = top + 'px';
}

/** Locks the rendered width so confirm-swaps ("Confirm") don't shrink the menu. */
function freezeWidth(menuEl: HTMLElement) {
    setTimeout(() => {
        menuEl.style.width = menuEl.offsetWidth + 'px';
    }, 50);
}
