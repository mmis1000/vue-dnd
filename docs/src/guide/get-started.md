# Getting started

## Prerequisites

- Vue 3.x

## Setup environments

### Install dependency

Run the following command in a vue 3 project.

:::: code-group
::: code-group-item NPM

```bash
npm install @mmis1000/vue-dnd
```

:::
::: code-group-item YARN

```bash
yarn install @mmis1000/vue-dnd
```

:::
::::

### Add a provider

Install one of the provider on the top level of your project

#### HTML provider

supports file upload but don't really works with touch devices

:::: code-group
::: code-group-item Hook

```diff
  <script setup>
+ import { useHtmlProvider } from '@mmis1000/vue-dnd'
+ useHtmlProvider()
  </script>
```

:::
::: code-group-item HOC

```diff
  <template>
+   <HtmlProvider>
      <Page>
+   </HtmlProvider>
  </template>
  <script setup>
+ import { HtmlProvider } from '@mmis1000/vue-dnd'
  </script>
```

:::
::::

#### Pointer event provider

works with touch devices, but don't support file upload

:::: code-group
::: code-group-item Hook

```diff
  <script setup>
+ import { usePointerEventProvider } from '@mmis1000/vue-dnd'
+ usePointerEventProvider()
  </script>
```

:::
::: code-group-item HOC

```diff
  <template>
+   <PointerEventProvider>
      <Page>
+   </PointerEvenProvider>
  </template>
  <script setup>
+ import { PointerEvenProvider } from '@mmis1000/vue-dnd'
  </script>
```

:::
::::
