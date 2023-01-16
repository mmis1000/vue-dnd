<script setup lang="ts">
import ExampleSimple from './components/ExampleSimple.vue';
import ExampleHandle from './components/ExampleHandle.vue';
import Board from './components/ChessBoard.vue';
import Board2 from './components/ChessBoard2.vue';
import SortableList from './components/SortableList.vue';
import StartDirection from './components/StartDirection.vue';
import DropNative from './components/DropNative.vue';

</script>

<template>
  <div>Simple Example</div>
  <ExampleSimple />
  <div>Simple Example (use pointer event)</div>
  <ExampleSimple :use-pointer-event="true" />
  <div>Simple Example with handle (use pointer event)</div>
  <ExampleHandle />
  <div>Simple Example with handle</div>
  <ExampleHandle :use-pointer-event="true" />
  <div>Native Provider</div>
  <Board />
  <div>Pointer Event Provider</div>
  <Board :use-pointer-event="true" />
  <div>Sortable Native</div>
  <Board2 />
  <div>Pointer Event Provider</div>
  <Board2 :use-pointer-event="true" />
  <div>Sortable Native</div>
  <SortableList />
  <div>Sortable Pointer Event</div>
  <SortableList :use-pointer-event="true" />
  <div>All</div>
  <StartDirection
    use-pointer-event
    start-direction="all"
  />
  <div>X</div>
  <StartDirection
    use-pointer-event
    start-direction="x"
  />
  <div>Y</div>
  <StartDirection
    use-pointer-event
    start-direction="y"
  />
  <div>DropNative</div>
  <DropNative />
  <div class="broken">
    <SortableList :use-pointer-event="true" />
  </div>
</template>

<style scoped>
.broken {
  transform: translate(0, 0);
}
</style>
