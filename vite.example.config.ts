import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSx()],
  base: './',
  build: {
    sourcemap: true,
    outDir: './dist-example'
  }
})
