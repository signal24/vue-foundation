export interface OverlayAnchorOptionsObject {
    el: HTMLElement;
    class?: string | string[];
    x?: 'auto' | 'left' | 'center' | 'right';
    y?: 'auto' | 'above' | 'center' | 'below';
    matchWidth?: boolean;
    matchHeight?: boolean;
}

export type OverlayAnchorOptions = HTMLElement | OverlayAnchorOptionsObject;
