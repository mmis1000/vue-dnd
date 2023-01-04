<template>
    <div
        class="box"
        v-bind="propsItem()"
    ></div>
</template>
<script setup lang='ts'>
import { useDroppable } from '@mmis1000/vue-dnd';
import { useLogger } from '../example-util';
import { BallType } from "./type";

const log = useLogger()

const { propsItem, hoverState } = useDroppable(
        BallType,
            {
         onDrop: (ev, data) => {
            log(`item dropped ${data}`)
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