import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    plugins: [vue(), vueJSx()],
    build: {
        sourcemap: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            native: resolve(__dirname, 'native/index.html'),
          },
        },
    },
})
