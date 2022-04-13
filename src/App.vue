<script setup lang="ts">
import BoardNative from './components/BoardNative.vue';
import BoardPointerEvent from './components/BoardPointerEvent.vue';
</script>

<template>
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
