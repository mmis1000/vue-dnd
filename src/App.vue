<script setup lang="ts">
import ExampleSimple from './components/ExampleSimple.vue';
import ExampleHandle from './components/ExampleHandle.vue';
import BoardNative from './components/BoardNative.vue';
import BoardPointerEvent from './components/BoardPointerEvent.vue';
</script>

<template>
  <div>Simple Example</div>
  <ExampleSimple />
  <div>Simple Example with handle</div>
  <ExampleHandle />
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
