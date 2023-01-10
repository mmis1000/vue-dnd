<template>
    <div
    class="paper"
    :class="{ 'paper--dragging': state.isDragging }"
    v-bind="propsItem"
    >
        paper
    </div>
</template>
<script setup lang='ts'>
import { computed, h } from "vue";
import { useDraggable } from '@mmis1000/vue-dnd';
import { PaperType } from "./type";
import PaperPreview from "./BallPreview.vue";

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
    PaperType,
    computed<[string, 'paper', string]>(() => [props.index, 'paper', props.from]),
    {
        preview: () => h(PaperPreview, { index: props.index })
    }
);
</script>
<style scoped>
.paper {
    background: #5d1818;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    margin: 5px;
    line-height: 40px;
    position: relative;
    z-index: 1;
}
.paper--dragging {
    opacity: 50%;
}
</style>