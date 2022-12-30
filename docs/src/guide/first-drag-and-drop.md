# First drag and drop

## Create the event type

Before you setup the drag item and drop zone.  
You need a event type to pair them

<code-group>
<code-block title="Typescript" active>

```ts
import { createType } from '@mmis1000/vue-dnd'
// the DataType is what you used to identify the item for drag
type DataType = string
export const BallType = createType<DataType>()
```

</code-block>
<code-block title="Javascript">

```js
import { createType } from '@mmis1000/vue-dnd'
export const BallType = createType()
```

</code-block>
</code-group>

## Setup the drag target

Assume you already have a object on screen for drag

```html
<template>
    <div
        class="ball"
    >...</div>
</template>
<script setup lang="ts">
const props = defineProps({
    index: {
        type: String,
        required: true,
    }
});
</script>
<style>
/* ... */
</style>
```

You can decorate it with the hook

```diff html
  <template>
      <div
          class="ball"
+         v-bind="propsItem()"
      >...</div>
  </template>
  <script setup lang="ts">
+ import { computed } from "vue";
+ import { useDraggable } from '@mmis1000/vue-dnd';
+ import { BallType } from "./type";
  const props = defineProps({
      index: {
          type: String,
          required: true,
      }
  });
+ const { propsItem } = useDraggable(
+     BallType,
+     computed(() => props.index)
+ );
  </script>
  <style>
  /* ... */
  </style>
```

The item should be draggable now

## Setup the drop zone

Assume you already have a container on screen for drop item

```html
<template>
    <div
        class="box"
    >...</div>
</template>
<script setup lang="ts">
</script>
<style>
/* ... */
</style>
```

You can decorate it with the hook

```diff html
  <template>
      <div
          class="box"
+         v-bind="propsItem()"
      >...</div>
  </template>
  <script setup lang="ts">
+ import { useDroppable } from '@mmis1000/vue-dnd';
+ import { BallType } from "./type";
+ const { propsItem, hoverState } = useDroppable(
+     BallType,
+     {
+         onDrop: (ev, data) => {
+             console.log(`item dropped ${data}`)
+         }
+     }
+ );
  </script>
  <style>
  /* ... */
  </style>
```

Try to drag the item into drop zone.  
It should log the text you write in the drag item on the screen now.
