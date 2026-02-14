/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { VfOptions } from '../../config';
import {
    type OverlayInjection,
    createOverlayInjection,
    dismissOverlayInjectionById,
    dismissOverlayInjectionByInstance,
    dismissOverlayInjectionByVnode,
    OverlayContainer,
    presentOverlay,
    removeOverlayInjection,
    updateOverlayProps
} from '../overlay-container';

const TestComponent = defineComponent({
    props: {
        message: { type: String, default: 'test' },
        callback: { type: Function, default: undefined }
    },
    setup(props) {
        return () => h('div', { class: 'test-overlay' }, props.message);
    }
});

// Track all injections created during a test so we can clean up reliably
let trackedInjections: OverlayInjection<any>[] = [];

function tracked<C extends Parameters<typeof createOverlayInjection>>(...args: C): OverlayInjection<any> {
    const injection = (createOverlayInjection as any)(...args);
    trackedInjections.push(injection);
    return injection;
}

function mountOverlayContainer() {
    document.body.innerHTML = '';
    return mount(OverlayContainer, { attachTo: document.body });
}

function makeCallbackComp(className: string, text: string) {
    return defineComponent({
        props: { callback: { type: Function, default: undefined } },
        setup() {
            return () => h('div', { class: className }, text);
        }
    });
}

afterEach(() => {
    for (const injection of trackedInjections) {
        removeOverlayInjection(injection);
    }
    trackedInjections = [];
    document.body.innerHTML = '';
});

describe('createOverlayInjection', () => {
    it('creates #vf-overlay-target element', () => {
        tracked(TestComponent, { message: 'hello' } as any);
        const target = document.getElementById('vf-overlay-target');
        expect(target).toBeTruthy();
        expect(target!.parentElement).toBe(document.body);
    });

    it('reuses existing #vf-overlay-target element', () => {
        tracked(TestComponent, { message: 'first' } as any);
        tracked(TestComponent, { message: 'second' } as any);
        const targets = document.querySelectorAll('#vf-overlay-target');
        expect(targets).toHaveLength(1);
    });

    it('moves #vf-overlay-target to end of body on each call', () => {
        const other = document.createElement('div');
        other.id = 'other';
        document.body.appendChild(other);

        tracked(TestComponent, { message: 'test' } as any);
        expect(document.body.lastElementChild!.id).toBe('vf-overlay-target');
    });

    it('removes inert attribute from target', () => {
        const target = document.createElement('div');
        target.id = 'vf-overlay-target';
        target.setAttribute('inert', '');
        document.body.appendChild(target);

        tracked(TestComponent, { message: 'test' } as any);
        expect(document.getElementById('vf-overlay-target')!.hasAttribute('inert')).toBe(false);
    });

    it('returns injection with unique id', () => {
        const injection1 = tracked(TestComponent, { message: 'a' } as any);
        const injection2 = tracked(TestComponent, { message: 'b' } as any);
        expect(injection1.id).toBeTruthy();
        expect(injection2.id).toBeTruthy();
        expect(injection1.id).not.toBe(injection2.id);
    });

    it('returns injection with correct structure', () => {
        const props = { message: 'hello' } as any;
        const injection = tracked(TestComponent, props);
        expect(injection.component).toBeDefined();
        expect(injection.props).toBe(props);
        expect(injection.options).toEqual({});
        expect(injection.vnode).toBeDefined();
        expect(injection.wrapperVnode).toBeUndefined();
    });

    it('creates wrapperVnode when anchor option is provided', () => {
        const anchorEl = document.createElement('div');
        const injection = tracked(TestComponent, { message: 'test' } as any, { anchor: anchorEl });
        expect(injection.wrapperVnode).toBeDefined();
    });

    it('does not create wrapperVnode without anchor option', () => {
        const injection = tracked(TestComponent, { message: 'test' } as any);
        expect(injection.wrapperVnode).toBeUndefined();
    });
});

describe('presentOverlay', () => {
    const CallbackComponent = defineComponent({
        props: {
            label: { type: String, default: '' },
            callback: { type: Function, required: true }
        },
        setup(props) {
            return () => h('button', { class: 'close-btn', onClick: () => props.callback(props.label || undefined) }, 'Close');
        }
    });

    it('resolves with callback result', async () => {
        mountOverlayContainer();
        const promise = presentOverlay(CallbackComponent, { label: 'result-value' } as any);

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        target.querySelector<HTMLButtonElement>('.close-btn')!.click();

        const result = await promise;
        expect(result).toBe('result-value');
    });

    it('removes injection after callback resolves', async () => {
        const onChanged = vi.fn();
        VfOptions.onOverlaysChanged = onChanged;

        mountOverlayContainer();
        const promise = presentOverlay(CallbackComponent, {} as any);

        await vi.dynamicImportSettled();
        const countBeforeDismiss = onChanged.mock.calls[onChanged.mock.calls.length - 1]?.[0];

        document.getElementById('vf-overlay-target')!.querySelector<HTMLButtonElement>('.close-btn')!.click();
        await promise;
        await nextTick();

        const countAfterDismiss = onChanged.mock.calls[onChanged.mock.calls.length - 1]?.[0];
        expect(countAfterDismiss).toBe(countBeforeDismiss - 1);
    });

    it('calls onCallback hook before resolving', async () => {
        const onCallback = vi.fn();

        mountOverlayContainer();
        const promise = presentOverlay(CallbackComponent, { label: 'val' } as any, { onCallback });

        await vi.dynamicImportSettled();
        document.getElementById('vf-overlay-target')!.querySelector<HTMLButtonElement>('.close-btn')!.click();
        await promise;

        expect(onCallback).toHaveBeenCalledWith('val');
    });

    it('prevents dismissal when onCallback returns Promise<false>', async () => {
        const onCallback = vi.fn(() => Promise.resolve(false as const));

        mountOverlayContainer();
        const promise = presentOverlay(CallbackComponent, {} as any, { onCallback });

        await vi.dynamicImportSettled();
        const btn = document.getElementById('vf-overlay-target')!.querySelector<HTMLButtonElement>('.close-btn')!;
        btn.click();

        // Wait for the async onCallback to process
        await nextTick();
        await vi.dynamicImportSettled();

        // Overlay should still be present
        expect(document.getElementById('vf-overlay-target')!.querySelector('.close-btn')).toBeTruthy();

        // Now allow dismissal
        onCallback.mockReturnValue(Promise.resolve(true) as any);
        btn.click();
        await promise;
    });

    it('allows dismissal when onCallback returns void', async () => {
        const onCallback = vi.fn(); // returns undefined (void)

        mountOverlayContainer();
        const promise = presentOverlay(CallbackComponent, {} as any, { onCallback });

        await vi.dynamicImportSettled();
        document.getElementById('vf-overlay-target')!.querySelector<HTMLButtonElement>('.close-btn')!.click();
        await promise;

        expect(onCallback).toHaveBeenCalled();
    });
});

describe('dismissOverlayInjectionByVnode', () => {
    it('returns false when no matching injection exists', () => {
        const vnode = h('div');
        expect(dismissOverlayInjectionByVnode(vnode)).toBe(false);
    });

    it('calls callback and returns true when vnode matches', async () => {
        const callback = vi.fn();
        mountOverlayContainer();
        const injection = tracked(TestComponent, { message: 'test', callback } as any);

        await vi.dynamicImportSettled();

        const result = dismissOverlayInjectionByVnode(injection.vnode);
        expect(result).toBe(true);
        expect(callback).toHaveBeenCalled();
    });
});

describe('dismissOverlayInjectionById', () => {
    it('returns false when no matching id exists', () => {
        expect(dismissOverlayInjectionById('nonexistent')).toBe(false);
    });

    it('calls callback and returns true when id matches', () => {
        const callback = vi.fn();
        const injection = tracked(TestComponent, { message: 'test', callback } as any);

        const result = dismissOverlayInjectionById(injection.id);
        expect(result).toBe(true);
        expect(callback).toHaveBeenCalled();
    });

    it('handles injection without callback', () => {
        const injection = tracked(TestComponent, { message: 'test' } as any);
        const result = dismissOverlayInjectionById(injection.id);
        expect(result).toBe(true);
    });
});

describe('dismissOverlayInjectionByInstance', () => {
    it('does nothing when instance has no $ property', () => {
        dismissOverlayInjectionByInstance({} as any);
    });

    // dismissByInstance and dismissByInternalInstance walk the parent vnode
    // tree to find a matching overlay injection. This depends on Vue's internal
    // vnode identity which isn't reliably testable in happy-dom with Teleport.
    // The behavior is exercised through VfModal.closeParent() in vf-modal.spec.ts
    // and alert-helpers.spec.ts integration tests.
});

describe('removeOverlayInjection', () => {
    it('removes injection without calling callback', async () => {
        const callback = vi.fn();
        const injection = tracked(TestComponent, { message: 'test', callback } as any);

        removeOverlayInjection(injection);
        // Remove from tracked list too since we already cleaned it up
        trackedInjections = trackedInjections.filter(i => i !== injection);
        await nextTick();

        expect(callback).not.toHaveBeenCalled();
    });

    it('handles injection not in array', () => {
        const fakeInjection = { id: 'fake', component: TestComponent, props: {}, options: {}, vnode: h('div') } as any;
        removeOverlayInjection(fakeInjection);
    });
});

describe('updateOverlayProps', () => {
    it('updates props on rendered component', async () => {
        mountOverlayContainer();
        const injection = tracked(TestComponent, { message: 'initial' } as any);

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.textContent).toContain('initial');

        await updateOverlayProps(injection, { message: 'updated' } as any);
        await nextTick();
        expect(target.textContent).toContain('updated');
    });
});

describe('OverlayContainer component', () => {
    it('renders overlay content in #vf-overlay-target', async () => {
        mountOverlayContainer();
        tracked(TestComponent, { message: 'rendered-unique-1' } as any);

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.textContent).toContain('rendered-unique-1');
    });

    it('renders multiple overlays', async () => {
        const Comp1 = makeCallbackComp('multi-a', 'A');
        const Comp2 = makeCallbackComp('multi-b', 'B');

        mountOverlayContainer();
        tracked(Comp1, {} as any);
        tracked(Comp2, {} as any);

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.multi-a')).toBeTruthy();
        expect(target.querySelector('.multi-b')).toBeTruthy();
    });

    it('updates when injection is removed', async () => {
        const Comp1 = makeCallbackComp('remove-a', 'A');
        const Comp2 = makeCallbackComp('remove-b', 'B');

        mountOverlayContainer();
        const injection1 = tracked(Comp1, {} as any);
        tracked(Comp2, {} as any);

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;
        expect(target.querySelector('.remove-a')).toBeTruthy();
        expect(target.querySelector('.remove-b')).toBeTruthy();

        removeOverlayInjection(injection1);
        trackedInjections = trackedInjections.filter(i => i !== injection1);
        await nextTick();

        expect(target.querySelector('.remove-a')).toBeFalsy();
        expect(target.querySelector('.remove-b')).toBeTruthy();
    });
});

describe('onOverlaysChanged callback', () => {
    let onChanged: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onChanged = vi.fn();
        VfOptions.onOverlaysChanged = onChanged;
    });

    it('fires when injection is added', async () => {
        tracked(TestComponent, { message: 'test' } as any);
        await nextTick();
        expect(onChanged).toHaveBeenCalled();
    });

    it('fires when injection is removed', async () => {
        const injection = tracked(TestComponent, { message: 'a' } as any);
        await nextTick();
        const callCountAfterAdd = onChanged.mock.calls.length;

        removeOverlayInjection(injection);
        trackedInjections = trackedInjections.filter(i => i !== injection);
        await nextTick();

        expect(onChanged.mock.calls.length).toBeGreaterThan(callCountAfterAdd);
    });

    it('does not throw when callback is not set', async () => {
        VfOptions.onOverlaysChanged = undefined;
        tracked(TestComponent, { message: 'test' } as any);
        await nextTick();
    });
});

describe('integration', () => {
    it('multiple presentOverlay calls stack and resolve independently', async () => {
        const CallbackComponent = defineComponent({
            props: {
                label: { type: String, default: '' },
                callback: { type: Function, required: true }
            },
            setup(props) {
                return () => h('button', { class: `btn-${props.label}`, onClick: () => props.callback(props.label) }, props.label);
            }
        });

        mountOverlayContainer();
        const promise1 = presentOverlay(CallbackComponent, { label: 'first' } as any);
        const promise2 = presentOverlay(CallbackComponent, { label: 'second' } as any);

        await vi.dynamicImportSettled();
        const target = document.getElementById('vf-overlay-target')!;

        expect(target.querySelector('.btn-first')).toBeTruthy();
        expect(target.querySelector('.btn-second')).toBeTruthy();

        target.querySelector<HTMLButtonElement>('.btn-first')!.click();
        const result1 = await promise1;
        expect(result1).toBe('first');

        await nextTick();
        expect(target.querySelector('.btn-second')).toBeTruthy();

        target.querySelector<HTMLButtonElement>('.btn-second')!.click();
        const result2 = await promise2;
        expect(result2).toBe('second');
    });

    it('createOverlayInjection + dismissById flow', () => {
        const callback = vi.fn();
        const injection = tracked(TestComponent, { message: 'test', callback } as any);
        expect(dismissOverlayInjectionById(injection.id)).toBe(true);
        expect(callback).toHaveBeenCalled();
    });
});
