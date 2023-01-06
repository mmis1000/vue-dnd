# Drop zone limit

In the previous guide, you probably already notice something went wrong.
There is a problem that you can drop the ball into the box where it is already in.

In fact, vue dnd can limit what item a drop zone should accept.

## Add the source to the message that drag item send to drop zone

Before limit it in drop zone.
we need to let drop zone know where the item was from.

But this information is not included in previous guide.

So we need to add it.

```ts{4-5}
/* type.ts */
import { createType } from '@mmis1000/vue-dnd'
// the DataType is what you used to identify the item for drag
// type DataType = string
type DataType = [item: string, from: string]
export const BallType = createType<DataType>()
```

```html{10-13,21-22}
<!-- ball.vue -->
<template>
    <!-- ... -->
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
const { propsItem } = useDraggable(
    BallType,
    // computed(() => props.index)
    computed<[string, string]>(() => [props.index, props.from])
);
</script>
<style>
/* ... */
</style>
```

```html{10}
<!-- app.vue -->
<template>
    <Box
        v-for="box in boxes"
        :key="box.id"
    >
        <Ball
            v-for="item in box.items"
            :key="item"
            :from="box.id"
            :index="item"
        ></Ball>
    </Box>
</template>
```

## Add the message filter and handle message format change

And now there is the important part.

We need to make the system know whether we want to accept the message or not

```html{22,24-25}
<template>
    <div
        class="box"
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

const { propsItem } = useDroppable(
    BallType.withFilter(([item, source]) => source !== props.index),
    {
        onDrop: (ev, [data, source]) => {
            console.log(`${data} from ${source} is dropped into ${props.index}`)
            emit('drop', [data, props.index])
        }
    }
);
</script>
<style>
/* ... */
</style>
```

## Result

As the result, you are now not allowed to drop ball into its own box.

<example-wrapper title="example" source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleDropZoneLimit"><example-drop-zone-limit-app></example-drop-zone-limit-app></example-wrapper>
