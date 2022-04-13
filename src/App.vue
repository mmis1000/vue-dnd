<script setup lang="ts">
import ExampleSimple from './components/ExampleSimple.vue';
import BoardNative from './components/BoardNative.vue';
import BoardPointerEvent from './components/BoardPointerEvent.vue';
</script>

<template>
  <div>Simple Example</div>
  <ExampleSimple />
  <div>Native Provider</div>
  <BoardNative />
  <div>Pointer Event Provider</div>
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
