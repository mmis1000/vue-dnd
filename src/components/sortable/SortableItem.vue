<template>
  <div class="item" v-bind:class="{ insertTop, insertDown, isPreview }" v-bind="mergePropsWithRef(propsItem, propsDropItem)">
    <textarea v-if="!disableInput" name="" id="" cols="30" rows="10" v-model="value">fd</textarea>
    <div v-else class="textarea">{{ value }}</div>
  </div>
</template>

<script setup lang="tsx">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, defineAsyncComponent, markRaw } from 'vue'
import { useDraggable, useDroppable, mergePropsWithRef } from '../../packages/vue-dnd';
import { ItemType } from './types';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['drop', 'update:modelValue'])

const value = computed({
  get () : string {
    return props.modelValue
  },
  set (v : string) {
    emit('update:modelValue', v)
  }
})

const Item = defineAsyncComponent(async () => (await import('./SortableItem.vue')).default)

const { propsItem, state } = useDraggable(
  ItemType,
  computed(() => props.index),
  {
    disabled: props.isPreview,
    preview: () => markRaw(<Item {...props} isPreview={true}/>)
  }
);

const { propsItem: propsDropItem, hoverState } = useDroppable(
  ItemType.withFilter((d) => {
    return d !== props.index;
  }),
  {
    disabled: props.isPreview,
    onDrop: (ev, data) => {
      emit("drop", { from: data, to: props.index });
    },
    onDragOver: (ev, data) => {
      console.log('Hover', props.id)
    }
  }
);

const item = computed(() => {
  return hoverState.hover ? hoverState.draggingItems[0] : null;
});

const insertTop = computed(() => {
  return item.value != null && item.value.data > props.index;
});

const insertDown = computed(() => {
  return item.value != null && item.value.data < props.index;
});

const disableInput = computed(() => {
  return props.isPreview || hoverState.draggingItems.length > 0
})
</script>

<style scoped>
.item {
  box-sizing: border-box;
  height: 80px;
  padding: 8px;
  border: 1px #777 solid;
  position: relative;
  background: white;
  border-radius: 4px;
}

.item textarea, .item .textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  padding: 2px;
  margin: 0;
  border: 1px #333 solid;
  font-family: monospace;
}

.item.insertTop::after {
  position: absolute;
  content: "";
  left: 8px;
  right: 8px;
  top: -6px;
  border-top: 2px #77f solid;
}

.item.insertDown::after {
  position: absolute;
  content: "";
  left: 8px;
  right: 8px;
  bottom: -6px;
  border-top: 2px #77f solid;
}

.item:not(:first-child) {
  margin-top: 8px;
}

.item.isPreview {
  opacity: 0.8;
}
</style>