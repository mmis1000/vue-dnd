<script setup lang="ts">
import ExampleSimple from './components/ExampleSimple.vue';
import BoardNative from './components/BoardNative.vue';
import BoardPointerEvent from './components/BoardPointerEvent.vue';
</script>

<template>
  Simple Example
  <ExampleSimple />
  Native Provider
  <BoardNative />
  Pointer Event Provider
  <BoardPointerEvent />
</template>

<style scoped>
.wrap {
  display: inline-block;
}
.row {
  display: flex;
}
</style>
