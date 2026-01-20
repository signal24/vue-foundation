import { afterEach, describe, expect, it, vi } from 'vitest';

import { vTooltip } from './tooltip';

describe('tooltip directive', () => {
    it('should show tooltip on mouseenter', () => {
        vi.useFakeTimers();
        const el = document.createElement('div');
        document.body.appendChild(el);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vTooltip.mounted!(el, { value: 'Tip Text' } as any, null as any, null as any);

        // Mouse enter
        el.dispatchEvent(new MouseEvent('mouseenter'));

        // Wait for delay
        vi.advanceTimersByTime(100);

        const tip = document.querySelector('.vf-tooltip');
        expect(tip).not.toBeNull();
        expect(tip?.textContent).toBe('Tip Text');

        // Cleanup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vTooltip.unmounted!(el, { value: 'Tip Text' } as any, null as any, null as any);
        vi.useRealTimers();
    });

    it('should hide tooltip on mouseleave', () => {
        vi.useFakeTimers();
        const el = document.createElement('div');
        document.body.appendChild(el);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vTooltip.mounted!(el, { value: 'Tip Text' } as any, null as any, null as any);

        // Show it
        el.dispatchEvent(new MouseEvent('mouseenter'));
        vi.advanceTimersByTime(100);
        expect(document.querySelector('.vf-tooltip')).not.toBeNull();

        // Hide it
        el.dispatchEvent(new MouseEvent('mouseleave'));
        expect(document.querySelector('.vf-tooltip')).toBeNull();

        vi.useRealTimers();
    });
});
