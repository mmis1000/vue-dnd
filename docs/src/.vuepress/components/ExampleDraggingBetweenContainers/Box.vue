<template>
    <div
        class="box"
        v-bind="propsItem()"
    ><slot></slot></div>
</template>
<script setup lang='ts'>
import { useDroppable } from '@mmis1000/vue-dnd';
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
    BallType,
    {
        onDrop: (ev, data) => {
            log(`${data} is dropped into ${props.index}`)
            emit('drop', [data, props.index])
        }
    }
);
</script>
<style>
.box {
    background: #185d18;
    border-radius: 10px;
    height: 100px;
    width: 100px;
    padding: 5px;
    box-sizing: border-box;
    margin: 5px;
}
</style>