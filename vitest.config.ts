import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'happy-dom',
            exclude: [...configDefaults.exclude, 'e2e/*'],
            root: fileURLToPath(new URL('./', import.meta.url)),
            setupFiles: ['./src/__test-utils__/setup.ts'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html', 'lcov'],
                reportsDirectory: './coverage',
                include: ['src/**/*.ts', 'src/**/*.vue'],
                exclude: [
                    '**/__tests__/**',
                    '**/__test-utils__/**',
                    '**/index.ts',
                    'src/types.ts',
                    'src/components/overlay-types.ts',
                    'src/components/vf-smart-select.types.ts',
                    'src/vite-plugins/**',
                    'src/**/*.d.ts'
                ]
            }
        }
    })
);
