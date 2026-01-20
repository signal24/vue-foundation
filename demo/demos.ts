import type { Component } from 'vue';

export interface DemoItem {
    name: string;
    component: Component;
}

export interface DemoCategory {
    name: string;
    demos: DemoItem[];
}

import DemoDirectivesAutofocus from './components/demo-directives-autofocus.vue';
import DemoDirectivesConfirmButton from './components/demo-directives-confirm-button.vue';
import DemoDirectivesDateInput from './components/demo-directives-date-input.vue';
import DemoDirectivesDatetime from './components/demo-directives-datetime.vue';
import DemoDirectivesDisabled from './components/demo-directives-disabled.vue';
import DemoDirectivesDuration from './components/demo-directives-duration.vue';
import DemoDirectivesHotkey from './components/demo-directives-hotkey.vue';
import DemoDirectivesInfiniteScroll from './components/demo-directives-infinite-scroll.vue';
import DemoDirectivesReadonly from './components/demo-directives-readonly.vue';
import DemoDirectivesStickyMinWidth from './components/demo-directives-sticky-min-width.vue';
import DemoDirectivesTooltip from './components/demo-directives-tooltip.vue';
import DemoFilters from './components/demo-filters.vue';
import DemoHelpersArray from './components/demo-helpers-array.vue';
import DemoHelpersContextMenu from './components/demo-helpers-context-menu.vue';
import DemoHelpersDelay from './components/demo-helpers-delay.vue';
import DemoHelpersError from './components/demo-helpers-error.vue';
import DemoHelpersMask from './components/demo-helpers-mask.vue';
import DemoHelpersNumber from './components/demo-helpers-number.vue';
import DemoHelpersObject from './components/demo-helpers-object.vue';
import DemoHelpersOpenApi from './components/demo-helpers-openapi.vue';
import DemoHelpersString from './components/demo-helpers-string.vue';
import DemoHooksInfiniteScroll from './components/demo-hooks-infinite-scroll.vue';
import DemoHooksResizeWatcher from './components/demo-hooks-resize-watcher.vue';
import DemoComponentsModals from './components/demo-components-modals.vue';
import DemoComponentsSelects from './components/demo-components-selects.vue';
import DemoVfAlertModal from './components/demo-vf-alert-modal.vue';
import DemoVfSmartSelect from './components/demo-vf-smart-select.vue';

export const demos: DemoCategory[] = [
    {
        name: 'Components',
        demos: [
            { name: 'VfAlertModal (Legacy)', component: DemoVfAlertModal },
            { name: 'VfSmartSelect (Legacy)', component: DemoVfSmartSelect },
            { name: 'Selects', component: DemoComponentsSelects },
            { name: 'Modals & Toasts', component: DemoComponentsModals }
        ]
    },
    {
        name: 'Helpers',
        demos: [
            { name: 'Array', component: DemoHelpersArray },
            { name: 'ContextMenu', component: DemoHelpersContextMenu },
            { name: 'Delay', component: DemoHelpersDelay },
            { name: 'Error', component: DemoHelpersError },
            { name: 'Mask', component: DemoHelpersMask },
            { name: 'Number', component: DemoHelpersNumber },
            { name: 'Object', component: DemoHelpersObject },
            { name: 'OpenApi', component: DemoHelpersOpenApi },
            { name: 'String', component: DemoHelpersString }
        ]
    },
    {
        name: 'Filters',
        demos: [{ name: 'All Filters', component: DemoFilters }]
    },
    {
        name: 'Directives',
        demos: [
            { name: 'Autofocus', component: DemoDirectivesAutofocus },
            { name: 'ConfirmButton', component: DemoDirectivesConfirmButton },
            { name: 'DateInput', component: DemoDirectivesDateInput },
            { name: 'Datetime', component: DemoDirectivesDatetime },
            { name: 'Disabled', component: DemoDirectivesDisabled },
            { name: 'Duration', component: DemoDirectivesDuration },
            { name: 'Hotkey', component: DemoDirectivesHotkey },
            { name: 'InfiniteScroll', component: DemoDirectivesInfiniteScroll },
            { name: 'Readonly', component: DemoDirectivesReadonly },
            { name: 'StickyMinWidth', component: DemoDirectivesStickyMinWidth },
            { name: 'Tooltip', component: DemoDirectivesTooltip }
        ]
    },
    {
        name: 'Hooks',
        demos: [
            { name: 'InfiniteScroll', component: DemoHooksInfiniteScroll },
            { name: 'ResizeWatcher', component: DemoHooksResizeWatcher }
        ]
    }
];
