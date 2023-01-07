# Dropping zone state

Besides make the item being dragged transparent.

You may want to give user a hint where you can drop the item.

So we expose a few useful state to the dropping zone.

```ts
// const { propsItem } = useDroppable(/* ... */)
const { propsItem, hoverState } = useDroppable(/* ... */)
```

## Useful properties

The hoverState has a few properties, there are 3 that we want to focus here

- `dragging`: whether there is any ongoing dnd
- `hover`: whether the dragging item is currently on the top of this drop zone
- `accepted`: whether the current dropzone wish to accept this dragging item

## Example

Let's try to add background to indicate whether it is allow to drop it into the container

```html{4,22,31-55}
<template>
    <div
        class="box"
        :style="extraStyle"
        v-bind="propsItem"
    ></div>
</template>
<script setup lang='ts'>
import { useDroppable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";

const props = defineProps({
    index: {
        type: String,
        required: true,
    }
});
const emit = defineEmits<{
    (ev: 'drop', item: [item: string, target: string]): void
}>()

const { propsItem, hoverState } = useDroppable(
    BallType.withFilter(([item, source]) => source !== props.index),
    {
        onDrop: (ev, [data, source]) => {
            console.log(`${data} from ${source} is dropped into ${props.index}`)
            emit('drop', [data, props.index])
        }
    }
);

const extraStyle = computed(() => {
    if (!hoverState.dragging) {
        return {} // we aren't even dragging
    }
    if (hoverState.hover) {
        if (hoverState.accepted) {
            return {
                background: 'green'
            }
        } else {
            return {
                background: 'red'
            }
        }
    } else {
        if (hoverState.accepted) {
            return {
                background: 'blue'
            }
        } else {
            return {}
        }
    }
})
</script>
<style>
/* ... */
</style>
```

## Result

<example-wrapper
    title="example"
    source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleDroppingState/App.vue"
    :options="[
        {
            name: 'provider',
            type: 'radio',
            value: 'html',
            options: [
                { text: 'HTML', value: 'html' },
                { text: 'Pointer', value: 'pointer' }
            ]
        }
    ]"
>
<template v-slot="{ provider }">
<example-dropping-state-app :provider="provider"></example-dropping-state-app>
</template>
</example-wrapper>
