<script setup lang="ts">
import ExampleSimple from './components/ExampleSimple.vue';
import ExampleHandle from './components/ExampleHandle.vue';
import Board from './components/Board.vue';
import SortableList from './components/SortableList.vue';
import StartDirection from './components/StartDirection.vue';
import DropNative from './components/DropNative.vue';

</script>

<template>
  <div>Simple Example</div>
  <ExampleSimple />
  <div>Simple Example (use pointer event)</div>
  <ExampleSimple :usePointerEvent="true" />
  <div>Simple Example with handle (use pointer event)</div>
  <ExampleHandle />
  <div>Simple Example with handle</div>
  <ExampleHandle :usePointerEvent="true" />
  <div>Native Provider</div>
  <Board />
  <div>Pointer Event Provider</div>
  <Board :usePointerEvent="true" />
  <div>Sortable Native</div>
  <SortableList />
  <div>Sortable Pointer Event</div>
  <SortableList :usePointerEvent="true" />
  <div>All</div>
  <StartDirection usePointerEvent startDirection="all" />
  <div>X</div>
  <StartDirection usePointerEvent startDirection="x" />
  <div>Y</div>
  <StartDirection usePointerEvent startDirection="y" />
  <div>DropNative</div>
  <DropNative />
  <div class="broken">
    <SortableList :usePointerEvent="true" />
  </div>
</template>

<style scoped>
.broken {
  transform: translate(0, 0);
}
</style>
