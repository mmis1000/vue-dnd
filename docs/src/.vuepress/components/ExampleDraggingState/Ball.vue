<template>
    <div
    class="ball"
    :class="{ 'ball--dragging': state.isDragging }"
    v-bind="propsItem"
    >
        {{ index }}
    </div>
</template>
<script setup lang='ts'>
import { computed } from "vue";
import { useDraggable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";

const props = defineProps({
    from: {
        type: String,
        required: true,
    },
    index: {
        type: String,
        required: true,
    }
});
const { propsItem, state } = useDraggable(
    BallType,
    computed<[string, string]>(() => [props.index, props.from])
);
</script>
<style>
.ball {
    background: #5d1818;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    margin: 5px;
    line-height: 40px;
    position: relative;
    z-index: 1;
}
.ball--dragging {
    opacity: 50%;
}
</style>