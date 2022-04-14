import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSx from '@vitejs/plugin-vue-jsx'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'

const resolvePath = (str: string) => path.resolve(__dirname, str)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSx()],
  base: './',
  build: {
    sourcemap: true,
    outDir: './dist-example'
  }
})
