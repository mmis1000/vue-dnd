<template>
  <div
    :class="props.dark ? 'a dark' : 'a'"
    :style="computedState"
    v-bind="propsItem"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropType, computed } from "vue";
import { useDroppable } from "../../packages/vue-dnd/use-droppable";
import { RootType, KnightType, Piece } from "./type";

const emit = defineEmits<{
  (e: "drop", data: { from: [number, number], to: [number, number], type: Piece }): void;
}>();

const props = defineProps({
  index: {
    type: Array as unknown as PropType<[number, number]>,
    required: true,
  },
  dark: Boolean,
});

const { propsItem, hoverState } = useDroppable(
  [
    KnightType.withFilter(([, x, y]) => {
      if (
        (Math.abs(x - props.index[0]) === 1 &&
          Math.abs(y - props.index[1]) === 2) ||
        (Math.abs(x - props.index[0]) === 2 &&
          Math.abs(y - props.index[1]) === 1)
      ) {
        return true;
      } else {
        return false;
      }
    }),
    RootType.withFilter(([, x, y]) => {
      if (
        (x ===  props.index[0] || y ===  props.index[1]) &&
        (x !== props.index[0] || y !== props.index[1])
      ) {
        return true;
      } else {
        return false;
      }
    })
  ],
  {
    onDrop: (_ev, data) => {
      emit("drop", { from: [data[1], data[2]], to: props.index, type: data[0] });
    },
    onDragOver(ev, data) {},
  }
);

const computedState = computed((): Record<string, string> => {
  const state = hoverState;
  if (state.hover) {
    if (state.accepted) {
      return { background: "green", "user-select": "none" };
    } else {
      return { background: "red", "user-select": "none" };
    }
  } else if (state.dragging) {
    if (state.accepted) {
      return { background: "blue", "user-select": "none" };
    } else {
      return { "user-select": "none" };
    }
  } else {
    return {};
  }
});
</script>

<style scoped>
.a {
  width: 80px;
  height: 80px;
  background-color: white;
}
.a.dark {
  background-color: black;
  color: white;
}
</style>
