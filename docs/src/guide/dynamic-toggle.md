# Dynamic toggle

Both `useDraggable` and `useDroppable` accepts `Ref<T>` as `type` or `data`

By use this with  `ref` or `computed`,
you can make the type/value emits/accepts changes dynamically.

Additionally,  
Hooks also have a `disabled` option that allow you to toggle it on/of dynamically

for example

```ts{10,15}
const props = definedProps({
    type: {
        type: String
    },
    disabled: {
        type: Boolean
    }
})
const { propsItem } = useDroppable(
    computed(() => props.type === 'ball' ? BallType : PaperType),
    {
        onDrop: (ev, data) => {
            console.log(`${data} dropped`)
        },
        disabled: computed(() => props.disabled)
    }
);
```

```ts{14,15,17}
const props = definedProps({
    type: {
        type: String
    },
    index: {
        type: String
    },
    disabled: {
        type: Boolean
    }
})

const { propsItem } = useDraggable(
    computed(() => props.type === 'ball' ? BallType : PaperType),
    computed(() => props.index),
    {
        disabled: computed(() => props.disabled)
    }
);
```
