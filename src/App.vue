<script setup lang="ts">
import { ref } from 'vue';
import MyDrag from './components/MyDrag.vue';
import MyDrop from './components/MyDrop.vue';
import { useProvider } from './components/vue-dnd/use-provider';
useProvider()

let all = ref(10)
let current = ref(1)

</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <MyDrop v-for="i of all" :index="i" :key="i" @drop="current = i">
    <MyDrag v-if="i === current" :index="current">{{i}}</MyDrag>
  </MyDrop>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
