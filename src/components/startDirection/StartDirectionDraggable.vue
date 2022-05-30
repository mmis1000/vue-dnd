<template>
    <div class="ball" :style="{ 'opacity': state.isDragging ? '0.5' : '1' }" v-bind="propsItem()">
      {{startDirection}}
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { StartDirection, useDraggable, createType } from '../../packages/vue-dnd';

const props = defineProps({
  startDirection: {
    type: String as unknown as new () => StartDirection,
    default: 'all' as StartDirection
  }
});
const { startDirection } = toRefs(props)
const Null = createType()
const { propsItem, state } = useDraggable(
  Null,
  {
    data: undefined,
    startDirection
  }
);
</script>

<style scoped>
.ball {
  width: 50px;
  height: 50px;
  background: red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>