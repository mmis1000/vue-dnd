
<template>
    <Component :is="provider === 'html' ? HtmlProvider : PointerEventProvider">
        <Box
            v-for="box in boxes"
            :index="box.id"
            :key="box.id"
            @drop="onDrop"
        >
            <Ball
                v-for="item in box.items"
                :key="item"
                :index="item"
            ></Ball>
        </Box>
    </Component>
</template>
    
<script setup lang='ts'>
import { PropType, ref } from 'vue';
import Ball from './Ball.vue';
import Box from './Box.vue';
import { HtmlProvider, PointerEventProvider } from '@mmis1000/vue-dnd'

defineProps({
    provider: {
        type: String as unknown as PropType<'html' | 'pointer'>,
        default: 'html'
    }
})

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
    },
    {
        id: 'C',
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