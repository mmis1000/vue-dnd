<template>
    <div
        class="box"
        v-bind="propsItem"
    >
        <slot></slot>
        <span class="label">{{ index }}</span>
    </div>
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

const { propsItem } = useDroppable(
    BallType.withFilter((s) => s[1] !== props.index),
    {
        onDrop: (ev, [data, source]) => {
            log(`${data} from ${source} is dropped into ${props.index}`)
            emit('drop', [data, props.index])
        }
    }
);
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
}
</style>