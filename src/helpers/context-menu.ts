interface ContextMenuItem {
    title: string;
    handler: () => void;
    class?: string;
    shouldConfirm?: boolean;
}

interface ContextMenuConfig {
    targetClass?: string;
    class?: string;
    items: (ContextMenuItem | '-')[];
}

export function showContextMenu(e: MouseEvent, config: ContextMenuConfig) {
    const wrapperEl = document.createElement('div');
    wrapperEl.classList.add('vf-overlay');
    wrapperEl.addEventListener('click', closeMenu);
    document.body.appendChild(wrapperEl);

    const menuEl = document.createElement('div');
    menuEl.classList.add('vf-context-menu');
    menuEl.style.position = 'absolute';
    wrapperEl.appendChild(menuEl);

    const target = e.currentTarget as HTMLElement;
    target.style.userSelect = 'none';
    target.classList.add('context-menu-active');

    if (config.targetClass) {
        target.classList.add(config.targetClass);
    }

    if (config.class) {
        menuEl.classList.add(config.class);
    }

    config.items.forEach(item => {
        if (item == '-') {
            const separatorEl = document.createElement('div');
            separatorEl.classList.add('separator');
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

        if (item.shouldConfirm) {
            itemEl.addEventListener('click', () => item.handler());
        } else {
            itemEl.addEventListener('click', () => confirmAction(itemEl, item.handler));
        }
    });

    const dx = window.innerWidth - e.clientX;
    const dy = window.innerHeight - e.clientY;
    const menuHeight = menuEl.offsetHeight;
    const menuWidth = menuEl.offsetWidth;

    const left = dx < menuWidth ? e.clientX - menuWidth - 1 : e.clientX + 1;
    const top = dy < menuHeight ? e.clientY - menuHeight - 1 : e.clientY + 1;

    menuEl.style.left = left + 'px';
    menuEl.style.top = top + 'px';

    setTimeout(() => {
        menuEl.style.width = menuEl.offsetWidth + 'px';
    }, 50);

    function closeMenu() {
        if (config.targetClass) {
            target.classList.remove(config.targetClass);
        }

        target.classList.remove('context-menu-active');
        target.style.userSelect = '';

        wrapperEl.remove();
    }

    function confirmAction(itemEl: HTMLElement, handler: () => void) {
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

// TODO: actually de-select text rather than just using CSS to hide its selection
