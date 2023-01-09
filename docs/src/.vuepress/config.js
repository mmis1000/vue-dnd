const { description } = require('../../package')
import { defaultTheme } from 'vuepress'
import { getDirname, path } from '@vuepress/utils'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from '@vuepress/cli'

const __dirname = getDirname(import.meta.url)
export default {
  base: '/vue-dnd/',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Vue Dnd',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  theme: defaultTheme({
    repo: 'https://github.com/mmis1000/vue-dnd',
    docsDir: 'docs/src',
    docsBranch: 'master',
    // default theme config
    navbar: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'API Reference',
        link: '/api/'
      },
      {
        text: 'Examples',
        link: 'https://mmis1000.me/vue-dnd/storybook'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          collapsable: false,
          children: [
            'get-started',
            'first-drag-and-drop',
            'drag-between-container',
            'drop-zone-limit',
            'dragging-state',
            'dropping-state',
            'custom-preview'
          ]
        }
      ],
    }
  }),
  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
      componentsPatterns: ['**/*.vue', '**/*.component.ts'],
      getComponentName: (filename) => {
        const name = path.trimExt(
          filename
            .replace('.component.ts', '.vue')
            .replace(/\/(?=[a-z])|\\(?=[a-z])/g, '-')
            .replace(/\/|\\/g, '')
        )
        return name
      },
    })
  ],
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          '@mmis1000/vue-dnd': path.resolve(__dirname, '../../../src/packages/vue-dnd')
        }
      },
      server: {
        fs: {
          allow: [
            path.resolve(__dirname, '../../'),
            path.resolve(__dirname, '../../../src/packages/vue-dnd')
          ]
        }
      },
      esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
      }
    },
    vuePluginOptions: {},
  }),
}
