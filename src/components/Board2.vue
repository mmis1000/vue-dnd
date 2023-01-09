<template>
  <div class="wrap">
    <div class="row" v-for="(row, i) in board" :key="i">
      <MyDrop
        class="drop"
        v-for="(slot, j) in row"
        :dark="(i + j) % 2 === 0"
        :index="memorize([i, j])"
        :key="i + ',' + j"
        @drop="update"
      >
        <MyDrag
          v-if="slot !== undefined"
          :dark="(i + j) % 2 === 1"
          :index="[i, j]"
          :type="slot"
          >{{ i }} {{ j }} {{ slot }}</MyDrag
        >
        <span v-else>{{ i }} {{ j }}</span>
      </MyDrop>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import MyDrag from "./board2/MyDrag.vue";
import MyDrop from "./board2/MyDrop.vue";
import { useHtmlProvider } from "../packages/vue-dnd/use-html-provider";
import { usePointerEventProvider } from "../packages/vue-dnd/use-pointer-event-provider";
import { Piece } from "./board2/type";

const props = defineProps({
  usePointerEvent: Boolean,
});

const map = new Map<string, [number, number]>()
const memorize = (tup: [number, number]) => {
  const old = map.get(tup.join('|'))
  if (old) {
    return old
  }
  map.set(tup.join('|'), tup)
  return tup
}

if (props.usePointerEvent) {
  usePointerEventProvider();
} else {
  useHtmlProvider();
}

let all = 8;
let board = reactive(Array.from({length: all}).map(() => Array.from({length: all}) as (Piece | undefined)[]))

board[0][0] = 'knight'
board[0][1] = 'root'

const update = ({
  from,
  to,
  type
}: {
  from: [number, number],
  to: [number, number],
  type: Piece
}) => {
  console.log(from, to, type)
  board[from[0]][from[1]] = undefined
  board[to[0]][to[1]] = type
}

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