<template>
  <List>
    <transition-group name="list">
      <Item
        v-for="(item, index) of list"
        :id="item.id"
        :key="item.id"
        v-model="item.value"
        :index="index"
        :class="{ moving: item.id === transitioning }"
        @drop="handleDrop"
        @transitionend="transitioning = -1"
      />
    </transition-group>
  </List>
  <DragLayer />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useHtmlProvider } from '../packages/vue-dnd';
import { usePointerEventProvider } from "../packages/vue-dnd/use-pointer-event-provider";
import Item from './sortable/SortableItem.vue'
import List from './sortable/SortableList.vue'
import { DragLayer } from "../packages/vue-dnd/DragLayer";

const props = defineProps({
  usePointerEvent: {
    type: Boolean,
    default: false
  },
});

if (props.usePointerEvent) {
  usePointerEventProvider();
} else {
  useHtmlProvider();
}

const list = reactive<Array<{
  id: number,
  value: string
}>>([]);

for (let i = 0; i < 10; i++) {
  list.push({
    id: i,
    value: String(i)
  });
}

const transitioning = ref(-1)

const handleDrop = ({ from, to }: { from: number, to: number }) => {
  transitioning.value = list[from].id

  const item = list[from];
  list.splice(from, 1);
  list.splice(to, 0, item);
}
</script>

<style scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.moving {
  position: relative;
  z-index: 1;
}
</style>