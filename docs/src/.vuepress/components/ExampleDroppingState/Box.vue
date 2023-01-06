<template>
    <div
        class="box"
        :style="extraStyle"
        v-bind="propsItem"
    >
        <slot></slot>
        <span class="label">{{ index }}</span>
    </div>
</template>
<script setup lang='ts'>
import { useDroppable } from '@mmis1000/vue-dnd';
import { computed } from 'vue';
import { useLogger } from '../example-util';
import { BallType } from "./type";

const log = useLogger()
const props = defineProps({
    index: {
        type: String,
        required: true,
    }
});
const emit = defineEmits<{
    (ev: 'drop', item: [item: string, target: string]): void
}>()

const { propsItem, hoverState } = useDroppable(
    BallType.withFilter((s) => s[1] !== props.index),
    {
        onDrop: (ev, [data, source]) => {
            log(`${data} from ${source} is dropped into ${props.index}`)
            emit('drop', [data, props.index])
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
<style>
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
}
</style>