<script setup lang="ts">
import BoardNative from './components/BoardNative.vue';
import BoardPointerEvent from './components/BoardPointerEvent.vue';
</script>

<template>
  <BoardNative />
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
