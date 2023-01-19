/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSx from '@vitejs/plugin-vue-jsx'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'

const resolvePath = (str: string) => path.resolve(__dirname, str)

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    transformMode: {
      web: [/.[tj]sx$/]
    }
  },
  plugins: [vue(), vueJSx()],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/packages/vue-dnd/index.ts'),
      name: 'VueDnd',
      fileName: (format) => `vue-dnd.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      },
      plugins: [
        typescript({
          'target': 'es2020',
          'rootDir': resolvePath('./src/packages/vue-dnd'),
          'declaration': true,
          'compilerOptions': {
            declarationMap: true
          },
          'declarationDir': resolvePath('./dist'),
          exclude: resolvePath('./node_modules/**'),
          allowSyntheticDefaultImports: true
        })
      ]
    }
  }
})
