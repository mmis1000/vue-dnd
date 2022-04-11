<script setup lang="ts">
import { ref } from 'vue';
import MyDrag from './components/MyDrag.vue';
import MyDrop from './components/MyDrop.vue';
import { useProvider } from './components/vue-dnd/use-provider';
useProvider()

let all = 8
let current = ref('1-1')

</script>

<template>
  <div class="row" v-for="i of all" :key="i">
    <MyDrop class="drop" :dark="(i + j) % 2 === 0" v-for="j of all" :index="i+'-'+j" :key="j" @drop="current = i+'-'+j">
      <MyDrag v-if="i+'-'+j === current" :index="current">{{i}}</MyDrag>
    </MyDrop>
  </div>
</template>

<style scoped>
.row {
  display: flex;
}
</style>
