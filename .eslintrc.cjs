/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier'],
    overrides: [
        {
            files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
            extends: ['plugin:cypress/recommended']
        },
        {
            files: ['vite.config.*', 'vitest.config.*', 'cypress.config.*', 'playwright.config.*'],
            env: {
                node: true
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    plugins: ['unused-imports', 'simple-import-sort'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'prettier/prettier': 'warn',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'all', argsIgnorePattern: '^_' }],
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off'
    }
};
