<template>
  Only works with pointer event provider. <br>
  There is no way to control how native dnd works
  <div class="wrap-out">
    <div class="wrap">
      <StartDirectionDraggable 
        :start-direction="props.startDirection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { StartDirection, useHtmlProvider, usePointerEventProvider } from '../packages/vue-dnd';
import StartDirectionDraggable from './startDirection/StartDirectionDraggable.vue';

const props = defineProps({
  usePointerEvent: {
    type: Boolean,
    default: false
  },
  startDirection: {
    type: String as unknown as new () => StartDirection,
    default: 'all' as StartDirection
  }
});

if (props.usePointerEvent) {
  usePointerEventProvider();
} else {
  useHtmlProvider();
}

</script>

<style scoped>
.wrap-out {
  width: 300px;
  height: 300px;
  overflow: auto;
}
.wrap {
  width: 400px;
  height: 400px;
  border: solid 1px grey;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='80' height='80' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M-20.133 4.568C-13.178 4.932-6.452 7.376 0 10c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'  stroke-width='1' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/><path d='M-20.133 24.568C-13.178 24.932-6.452 27.376 0 30c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'  stroke-width='1' stroke='hsla(339.6,82.2%,51.6%,1)' fill='none'/><path d='M-20.133 44.568C-13.178 44.932-6.452 47.376 0 50c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'  stroke-width='1' stroke='hsla(198.7,97.6%,48.4%,1)' fill='none'/><path d='M-20.133 64.568C-13.178 64.932-6.452 67.376 0 70c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'  stroke-width='1' stroke='hsla(47,80.9%,61%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
}
</style>