<template>
    <div
        class="box"
        :style="extraStyle"
        v-bind="propsItem"
    >
        <slot></slot>
        <span class="label">
            {{ index }}
            <template 
                v-for="accept of accepts" 
                :key="accept"
            >   
                <br>
                {{ accept }}
            </template>
        </span>
    </div>
</template>
<script setup lang='ts'>
import { useDroppable } from '@mmis1000/vue-dnd';
import { computed, PropType } from 'vue';
import { useLogger } from '../example-util';
import { BallType, PaperType } from "./type";

const log = useLogger()
const props = defineProps({
    index: {
        type: String,
        required: true,
    },
    accepts: {
        type: Array as unknown as PropType<('paper' | 'ball')[]>,
        default: () => []
    }
});
const emit = defineEmits<{
    (
        ev: 'drop',
        item: [item: string, type: 'ball', target: string] |
        [item: string, type: 'paper', target: string]
    ): void
}>()

const types = computed(() => props.accepts.map((i) => {
    if (i === 'ball') {
        return BallType.withFilter((s) => s[1] !== props.index)
    }
    if (i === 'paper') {
        return PaperType.withFilter((s) => s[1] !== props.index)
    }
    throw new Error(`unknown type ${i}`)
}))

const { propsItem, hoverState } = useDroppable(
    types,
    {
        onDrop: (ev, [data, type, source]) => {
            log(`${type} ${data} from ${source} is dropped into ${props.index}`)
            emit('drop', [data, type, props.index])
        }
    }
);

const extraStyle = computed(() => {
    if (!hoverState.dragging) {
        return {} // we aren't even dragging
    }
    if (hoverState.hover) {
        if (hoverState.accepted) {
            return {
                background: 'green'
            }
        } else {
            return {
                background: 'red'
            }
        }
    } else {
        if (hoverState.accepted) {
            return {
                background: 'blue'
            }
        } else {
            return {}
        }
    }
})
</script>
<style scoped>
.box {
    background: #777;
    border-radius: 10px;
    height: 100px;
    width: 100px;
    padding: 5px;
    box-sizing: border-box;
    margin: 5px;
    position: relative;
}
.label {
    display: block;
    position: absolute;
    right: 8px;
    top: 8px;
    opacity: 0.5;
    text-align: right;
}
</style>