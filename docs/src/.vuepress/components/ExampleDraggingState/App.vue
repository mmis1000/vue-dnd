
<template>
    <Box
        v-for="box in boxes"
        :index="box.id"
        :key="box.id"
        @drop="onDrop"
    >
        <Ball
            v-for="item in box.items"
            :key="item"
            :from="box.id"
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
        id: 'A',
        items: ['a', 'b']
    },
    {
        id: 'B',
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