import { afterEach, vi } from 'vitest';

import { VfOptions } from '../config';

const defaultOptions = { ...VfOptions };

// happy-dom does not implement the Web Animations API
if (!Element.prototype.animate) {
    Element.prototype.animate = vi.fn(() => ({
        cancel: vi.fn(),
        finish: vi.fn(),
        pause: vi.fn(),
        play: vi.fn(),
        reverse: vi.fn(),
        onfinish: null
    })) as never;
}

afterEach(() => {
    Object.assign(VfOptions, defaultOptions);

    const overlayTarget = document.getElementById('vf-overlay-target');
    if (overlayTarget) overlayTarget.remove();
});
