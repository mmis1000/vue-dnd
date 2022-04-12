import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSx from '@vitejs/plugin-vue-jsx'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'

const resolvePath = (str: string) => path.resolve(__dirname, str)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSx()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/vue-dnd/index.ts'),
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
          'rootDir': resolvePath('./src/components/vue-dnd'),
          'declaration': true,
          'declarationDir': resolvePath('./dist'),
          exclude: resolvePath('./node_modules/**'),
          allowSyntheticDefaultImports: true
        })
      ]
    }
  }
})
