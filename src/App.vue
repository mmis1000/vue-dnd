<script setup lang="ts">
import MyDrag from './components/MyDrag.vue';
import MyDrop from './components/MyDrop.vue';
import { useProvider } from './components/vue-dnd/use-provider';
useProvider()

</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <MyDrag :index="1"></MyDrag>
  <MyDrop :index="0"></MyDrop>
  <MyDrop :index="1"></MyDrop>
  <MyDrop :index="2"></MyDrop>
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
