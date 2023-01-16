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
import { BoardType } from "./type";

const emit = defineEmits<{
  (e: "drop", data: { index: [number, number] }): void;
}>();

const props = defineProps({
  index: {
    type: Array as unknown as PropType<[number, number]>,
    required: true,
  },
  dark: Boolean,
});

const { propsItem, hoverState } = useDroppable(
  BoardType.withFilter((d) => {
    if (
      (Math.abs(d[0] - props.index[0]) === 1 &&
        Math.abs(d[1] - props.index[1]) === 2) ||
      (Math.abs(d[0] - props.index[0]) === 2 &&
        Math.abs(d[1] - props.index[1]) === 1)
    ) {
      return true;
    } else {
      return false;
    }
  }),
  {
    onDrop: (ev, data) => {
      emit("drop", { index: props.index });
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
