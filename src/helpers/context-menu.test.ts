import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { showContextMenu } from './context-menu';

describe('showContextMenu', () => {
    let mockRemoveAllRanges: Mock;
    let target: HTMLElement;

    beforeEach(() => {
        // Mock getSelection
        mockRemoveAllRanges = vi.fn();
        window.getSelection = vi.fn().mockReturnValue({
            removeAllRanges: mockRemoveAllRanges
        });

        // Setup DOM
        document.body.innerHTML = '<div id="target">Content</div>';
        target = document.getElementById('target') as HTMLElement;
    });

    it('should programmatically deselect text and not use CSS to hide selection', () => {
        const mouseEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
        });
        Object.defineProperty(mouseEvent, 'currentTarget', { value: target, writable: true });

        showContextMenu(mouseEvent, { items: [] });

        // Assert new behavior: CSS NOT modified
        expect(target.style.userSelect).toBe('');

        // Assert new behavior: Programmatic deselection called
        expect(mockRemoveAllRanges).toHaveBeenCalled();
    });
});
