import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "src/index.js",
      name: 'vueFoundatation',
      formats: ["es", "cjs", "umd"],
      fileName: format => `vue-foundation.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      input: {
        main: path.resolve(__dirname, "src/index.js")
      },
      external: ['axios', 'jquery', 'lodash', 'moment', 'vue-stash-nested', 'vue'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') return 'vue-foundation.css';
          return assetInfo.name;
        },
        exports: "named",
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
