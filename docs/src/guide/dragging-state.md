# Dragging state

In previous example, our ball is always solid regardless of whether it is being dragged.

But you may want to hint the user which item he is currently dragging

This library expose this info as a computed to the hook,
and you can use it to change style correspondingly.

## Example

Let's try to make the item being dragged half transparent.

```html{5,27}
<!-- ball.vue -->
<template>
    <div
        class="ball"
        :class="{ 'ball--dragging': state.isDragging }"
        v-bind="propsItem"
    >
        {{ index }}
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useDraggable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";
const props = defineProps({
    from: {
        type: String,
        required: true,
    },
    index: {
        type: String,
        required: true,
    }
});
const {
    propsItem,
    state
} = useDraggable(
    BallType,
    // computed(() => props.index)
    computed<[string, string]>(() => [props.index, props.from])
);
</script>
<style>
/* ... */
</style>
```

## Result

<example-wrapper title="example" source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleDraggingState/App.vue"><example-dragging-state-app></example-dragging-state-app></example-wrapper>
