# Multi type drop zone

Instead accept a single type of input.
A drop zone can be configured to accept a list of inputs.
And each of them can have different filter set.

## Setup

Instead of accepting one type of items in previous example.

A Drop zone can have multi drop item at once by passing it as array

```ts{1-2,4-6}
// type BallDataType = [item: string, from: string]
type BallDataType = [item: string, type: 'ball', from: string]
export const BallType = createType<BallDataType>()

type PaperDataType = [item: string, type: 'paper', from: string]
export const PaperType = createType<PaperDataType>()
```

```ts{2-6,9-12}
const { propsItem, hoverState } = useDroppable(
    // BallType.withFilter(([item, source]) => source !== props.index),
    [
        BallType.withFilter(([item, type, source]) => source !== props.index),
        PaperType.withFilter(([item, type, source]) => source !== props.index)
    ],
    {
        onDrop: (ev, [data, type, source]) => {
            // console.log(`${data} from ${source} is dropped into ${props.index}`)
            // emit('drop', [data,props.index])
            console.log(`${type} ${data} from ${source} is dropped into ${props.index}`)
            emit('drop', [data, type, props.index])
        }
    }
);
```

The `data` that `onDrop` received will be a union of all types specified
and can be handled safely with typescript [Discriminating Unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions)

## Result

You can only drag item into the box specified

<example-wrapper
    title="example"
    source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleMultiTypeDropZone/App.vue"
    client-only
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
<example-multi-type-drop-zone-app :provider="provider"></example-multi-type-drop-zone-app>
</template>
</example-wrapper>
