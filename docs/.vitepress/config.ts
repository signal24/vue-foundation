import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitepress';

export default defineConfig({
    title: '@signal24/vue-foundation',
    description: 'Vue 3 component library — components, directives, helpers, hooks',
    base: '/vue-foundation/',

    themeConfig: {
        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Components', link: '/components/vf-modal' },
            { text: 'Directives', link: '/directives/v-autofocus' },
            { text: 'Helpers', link: '/helpers/error-handling' },
            { text: 'Hooks', link: '/hooks/use-infinite-scroll' }
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Getting Started', link: '/guide/getting-started' },
                    { text: 'Overlay System', link: '/guide/overlay-system' },
                    { text: 'CSS Reference', link: '/guide/css-reference' }
                ]
            },
            {
                text: 'Components',
                items: [
                    { text: 'VfModal', link: '/components/vf-modal' },
                    { text: 'Alert & Confirm', link: '/components/vf-alert-modal' },
                    { text: 'VfSmartSelect', link: '/components/vf-smart-select' },
                    { text: 'VfEzSmartSelect', link: '/components/vf-ez-smart-select' },
                    { text: 'VfAjaxSelect', link: '/components/vf-ajax-select' },
                    { text: 'Toast', link: '/components/toast' },
                    { text: 'Overlay API', link: '/components/overlay' }
                ]
            },
            {
                text: 'Directives',
                items: [
                    { text: 'v-autofocus', link: '/directives/v-autofocus' },
                    { text: 'v-tooltip', link: '/directives/v-tooltip' },
                    { text: 'v-hotkey', link: '/directives/v-hotkey' },
                    { text: 'v-datetime', link: '/directives/v-datetime' },
                    { text: 'v-date-input', link: '/directives/v-date-input' },
                    { text: 'v-duration', link: '/directives/v-duration' },
                    { text: 'v-confirm-button', link: '/directives/v-confirm-button' },
                    { text: 'v-infinite-scroll', link: '/directives/v-infinite-scroll' },
                    { text: 'v-disabled', link: '/directives/v-disabled' },
                    { text: 'v-readonly', link: '/directives/v-readonly' },
                    { text: 'v-sticky-min-width', link: '/directives/v-sticky-min-width' }
                ]
            },
            {
                text: 'Helpers',
                items: [
                    { text: 'Error Handling', link: '/helpers/error-handling' },
                    { text: 'Masking', link: '/helpers/masking' },
                    { text: 'Context Menu', link: '/helpers/context-menu' },
                    { text: 'String Utils', link: '/helpers/string-utils' },
                    { text: 'Number Utils', link: '/helpers/number-utils' },
                    { text: 'Array Utils', link: '/helpers/array-utils' },
                    { text: 'Object Utils', link: '/helpers/object-utils' },
                    { text: 'Delay', link: '/helpers/delay' },
                    { text: 'OpenAPI', link: '/helpers/openapi' }
                ]
            },
            {
                text: 'Hooks',
                items: [
                    { text: 'useInfiniteScroll', link: '/hooks/use-infinite-scroll' },
                    { text: 'useResizeWatcher', link: '/hooks/use-resize-watcher' }
                ]
            },
            {
                text: 'Filters',
                items: [{ text: 'createFilters', link: '/filters/' }]
            },
            {
                text: 'Types',
                items: [{ text: 'Utility Types', link: '/types/' }]
            },
            {
                text: 'Vite Plugins',
                items: [{ text: 'OpenAPI Generator', link: '/vite-plugins/openapi-generator' }]
            }
        ],

        socialLinks: [{ icon: 'github', link: 'https://github.com/signal24/vue-foundation' }],

        search: { provider: 'local' },

        editLink: {
            pattern: 'https://github.com/signal24/vue-foundation/edit/develop/docs/:path'
        }
    },

    vite: {
        resolve: {
            alias: {
                '@signal24/vue-foundation': fileURLToPath(new URL('../../src', import.meta.url)),
                '@': fileURLToPath(new URL('../../src', import.meta.url))
            }
        },
        ssr: {
            noExternal: ['lodash', 'mark.js', 'currency.js', 'uuid']
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler'
                }
            }
        }
    }
});
