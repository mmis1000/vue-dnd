<template>
    <div class="ball" v-bind="propsItem">
        {{ index }}
    </div>
</template>
<script setup lang='ts'>
import { computed } from "vue";
import { useDraggable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";

const props = defineProps({
    index: {
        type: String,
        required: true,
    }
});
const { propsItem } = useDraggable(
    BallType,
    computed(() => props.index)
);
</script>
<style scoped>
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
</style>