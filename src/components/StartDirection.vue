<template>
  <div class="wrap">
    <StartDirectionDraggable 
      :start-direction="props.startDirection"
    />
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
.wrap {
  width: 300px;
  height: 300px;
  border: solid 1px grey;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>