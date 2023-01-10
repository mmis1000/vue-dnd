
<template>
    <div class="wrap">
        <Component :is="provider === 'html' ? HtmlProvider : PointerEventProvider">
            <Box
                v-for="box in boxes"
                :key="box.id"

                :accepts="box.accepts"
                :index="box.id"
                @drop="onDrop"
            >
                <template
                    v-for="item in box.items"
                    :key="item.id"
                >
                    <Ball
                        v-if="item.type === 'ball'"
                        :from="box.id"
                        :index="item.id"
                    ></Ball>
                    <Paper
                        v-if="item.type === 'paper'"
                        :from="box.id"
                        :index="item.id"
                    ></Paper>
                </template>
            </Box>
            <Teleport to="body">
                <DragLayer />
            </Teleport>
        </Component>
    </div>
</template>
    
<script setup lang='ts'>
import { PropType, ref, Teleport } from 'vue';
import Ball from './Ball.vue';
import Box from './Box.vue';
import { DragLayer, HtmlProvider, PointerEventProvider } from '@mmis1000/vue-dnd'
import Paper from './Paper.vue';

defineProps({
    provider: {
        type: String as unknown as PropType<'html' | 'pointer'>,
        default: 'html'
    }
})


interface Box {
    id: string,
    accepts: ('ball' | 'paper')[]
    items: { type: 'ball' | 'paper', id: string }[]
}

const boxes = ref<Box[]>([
    {
        id: 'A',
        accepts: ['ball', 'paper'],
        items: [{ type: 'ball', id: 'a' }, { type: 'paper', id: 'b' }]
    },
    {
        id: 'B',
        accepts: ['ball'],
        items: []
    },
    {
        id: 'C',
        accepts: ['paper'],
        items: []
    }
])

const onDrop = (
    [item, type, target]
        : [item: string, type: 'ball' | 'paper',target: string]
) => {
    boxes.value = boxes.value.map(box => {
        if (box.id === target) {
            return {
                ...box,
                items: [...box.items.filter(i => i.id !== item), { type, id: item }]
            }
        } else {
            return {
                ...box,
                items: box.items.filter(i => i.id !== item)
            }
        }
    })
}
</script>
<style scoped>
.wrap {
    display: flex;
    flex-wrap: wrap;
}
</style>