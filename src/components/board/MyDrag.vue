<template>
  <div
    style="color: red"
    :class="{
      a: true,
      dark: props.dark,
      dragging: state.isDragging,
    }"
    v-bind="propsItem"
  >
    <template v-if="state.isDragging">
      "moving..."
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import { useDraggable } from "../../packages/vue-dnd/use-draggable";
import { BoardType } from "./type";

const props = defineProps({
  index: {
    type: Array as unknown as PropType<[number, number]>,
    required: true,
  },
  dark: Boolean,
});

const { propsItem, state } = useDraggable(
  BoardType,
  computed(() => props.index),
  {
    onDragStart(ev) {
      console.log("start", ev);
    },
  }
);
</script>

<style scoped>
.a {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #77df82;
}
.a.dark {
  background: #31502c;
}
.a.dragging {
  user-select: none;
  opacity: 0.5;
}
</style>
