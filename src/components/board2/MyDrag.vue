<template>
  <div style="color: red" :class="{
    a: true,
    dark: props.dark,
    dragging: state.isDragging,
  }" v-bind="propsItem">
    <template v-if="state.isDragging"> "moving..." </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import { useDraggable } from "../../packages/vue-dnd/use-draggable";
import { KnightType, Piece, RootType } from "./type";

const props = defineProps({
  index: {
    type: Array as unknown as PropType<[number, number]>,
    required: true,
  },
  dark: Boolean,
  type: {
    type: String as unknown as PropType<Piece>,
    required: true
  }
});

type MapToArgs<T> = [T, number, number]

const { propsItem, state } = useDraggable(
  computed(() => 
    props.type === 'knight' ? KnightType : RootType
  ),
  computed<MapToArgs<Piece>>(() =>
    props.type === 'knight' ? ['knight', ...props.index] : ['root', ...props.index]
  ),
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
