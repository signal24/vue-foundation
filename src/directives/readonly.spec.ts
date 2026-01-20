import { describe, expect, it } from 'vitest';

import { vReadonly } from './readonly';

describe('readonly directive', () => {
    it('should set readonly attribute when value is true', () => {
        const el = document.createElement('input');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vReadonly.beforeMount!(el, { value: true } as any, null as any, null as any);
        expect(el.hasAttribute('readonly')).toBe(true);
    });

    it('should remove readonly attribute when value is false', () => {
        const el = document.createElement('input');
        el.setAttribute('readonly', 'readonly');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vReadonly.updated!(el, { value: false } as any, null as any, null as any);
        expect(el.hasAttribute('readonly')).toBe(false);
    });

    it('should handle label wrapping input', () => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        label.appendChild(input);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vReadonly.beforeMount!(label, { value: true } as any, null as any, null as any);
        expect(input.hasAttribute('readonly')).toBe(true);
    });
});
