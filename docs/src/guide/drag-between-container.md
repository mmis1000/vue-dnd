# Dragging between containers

The vue dnd didn't manipulate the dom or data by itself.
It is just a command channel that send message between components.

In order to actually drag item between containers,
you need to change the data by yourself.

## Label the container with id

In order to drag item between containers,
container need to have a identifier so you know where the item was dragged into.

```html{12-17}
<!-- Box.vue -->
<template>
    <div
        class="box"
        v-bind="propsItem"
    >...</div>
</template>
<script setup lang="ts">
import { useDroppable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";

const props = defineProps({
    index: {
        type: String,
        required: true,
    }
});

const { propsItem } = useDroppable(
    BallType,
    {
        onDrop: (ev, data) => {
            console.log(`${data} dropped`)
        }
    }
);
</script>
<style>
/* ... */
</style>
```

## Make a list of containers

```html
<!-- App.vue -->
<template>
    <Box
        v-for="box in boxes"
        :key="box.id"
    >
        <Ball
            v-for="item in box.items"
            :key="item"
            :index="item"
        ></Ball>
    </Box>
</template>
    
<script setup lang='ts'>
import Ball from './Ball.vue';
import Box from './Box.vue';
import { useHtmlProvider } from '@mmis1000/vue-dnd'
useHtmlProvider()

interface Box {
    id: string,
    items: string[]
}

const boxes = reactive<Box[]>([
    {
        id: 'A',
        items: ['a', 'b']
    },
    {
        id: 'B',
        items: []
    },
    {
        id: 'C',
        items: []
    }
])
</script>
<style>
/* ... */
</style>
```

## Handle the message and emit event in drop target

```html{17-19,25-27}
<template>
    <div
        class="box"
        v-bind="propsItem"
    ></div>
</template>
<script setup lang='ts'>
import { useDroppable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";

const props = defineProps({
    index: {
        type: String,
        required: true,
    }
});
const emit = defineEmits<{
    (ev: 'drop', item: [item: string, target: string]): void
}>()

const { propsItem } = useDroppable(
    BallType,
    {
        onDrop: (ev, data) => {
            // console.log(`${data} dropped`)
            console.log(`${data} is dropped into ${props.index}`)
            emit('drop', [data, props.index])
        }
    }
);
</script>
<style>
/* ... */
</style>
```

## Handle the event and update the data in app

```html{6,38-56}
<!-- App.vue -->
<template>
    <Box
        v-for="box in boxes"
        :key="box.id"
        @drop="onDrop"
    >
        <Ball
            v-for="item in box.items"
            :key="item"
            :index="item"
        ></Ball>
    </Box>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue';
import Ball from './Ball.vue';
import Box from './Box.vue';
import { useHtmlProvider } from '@mmis1000/vue-dnd'
useHtmlProvider()

interface Box {
    id: string,
    items: string[]
}

const boxes = ref<Box[]>([
    {
        id: 'a',
        items: ['a']
    },
    {
        id: 'b',
        items: []
    }
])

const onDrop = (
    [item, target]
        : [item: string, target: string]
) => {
    boxes.value = boxes.value.map(box => {
        if (box.id === target) {
            return {
                ...box,
                items: [...box.items.filter(i => i !== item), item]
            }
        } else {
            return {
                ...box,
                items: box.items.filter(i => i !== item)
            }
        }
    })
}
</script>
```

## Result

<example-wrapper title="example" source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleDraggingBetweenContainers/App.vue"><example-dragging-between-containers-app></example-dragging-between-containers-app></example-wrapper>
