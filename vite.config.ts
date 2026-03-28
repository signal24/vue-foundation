import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import oxlintPlugin from 'vite-plugin-oxlint';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), oxlintPlugin()],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    build: {
        cssCodeSplit: false,
        lib: {
            entry: 'src/index.ts',
            name: 'VueFoundation',
            formats: ['es'],
            fileName: format => `vue-foundation.${format}.js`,
            cssFileName: 'vue-foundation'
        },
        rollupOptions: {
            external: ['date-fns', 'lodash', 'vue', '@vue/shared', '@zyno-io/openapi-client-codegen'],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
