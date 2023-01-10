# Native file support

Besides custom data passing between components.

Vue dnd also supports native `ondrop` events.

## Import `NativeFile` type

Before we create the drop zone, we need to import the special `NativeFile` type.

```ts
import { NativeFile } from '@mmis1000/vue-dnd'
```

This type is a special type that makes the `useDroppable` hook to receive
any drop events.

## Init the hook and handle the events

You just use this type like a regular `Type`, and handle the native event.

```ts
const image = ref('')
const { propsItem, hoverState } = useDroppable(
    NativeFile,
    {
        onDrop(ev: DragEvent) {
            if (ev.dataTransfer?.files.length ?? 0 > 0) {
                const file = ev.dataTransfer!.files.item(0)!
                if (!file.type.startsWith('image/')) {
                    console.log('not a image')
                    return
                }
                const url = URL.createObjectURL(file)
                if (image.value !== '') {
                    URL.revokeObjectURL(image.value)
                }
                image.value = url
                console.log('a image dropped')
            }
        }
    }
);
```

## Result

<example-wrapper
    title="example"
    source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleNativeFile"
>
<template v-slot:default>
<example-native-file-app></example-native-file-app>
</template>
</example-wrapper>

## Note

This type does not support `withFilter` because you can't get the content of
native drop events before `ondrop` happens.

This is a native limit and there is no way to workaround it.
