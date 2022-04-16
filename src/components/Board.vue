<template>
  <div class="wrap">
    <div class="row" v-for="i of all" :key="i">
      <MyDrop
        class="drop"
        :dark="(i + j) % 2 === 0"
        v-for="j of all"
        :index="[i, j]"
        :key="j"
        @drop="current = [i, j]"
      >
        <MyDrag
          v-if="current[0] === i && current[1] === j"
          :dark="(i + j) % 2 === 1"
          :index="current"
          >{{ i }} {{ j }}</MyDrag
        >
        <span v-else>{{ i }} {{ j }}</span>
      </MyDrop>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import MyDrag from "./board/MyDrag.vue";
import MyDrop from "./board/MyDrop.vue";
import { useHtmlProvider } from "../packages/vue-dnd/use-html-provider";
import { usePointerEventProvider } from "../packages/vue-dnd/use-pointer-event-provider";

const props = defineProps({
  usePointerEvent: Boolean,
});

if (props.usePointerEvent) {
  usePointerEventProvider();
} else {
  useHtmlProvider();
}

let all = 8;
let current = ref<[number, number]>([1, 1]);
</script>

<style scoped>
.wrap {
  display: inline-block;
  border: 4px solid blue;
}
.row {
  display: flex;
}
</style>

<style scoped>
</style>