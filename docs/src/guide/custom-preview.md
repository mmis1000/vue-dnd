# Custom drag preview

In previous chapter,
you probably already noticed that the pointer event provider has a few caveats.

For example

- you can't drag the item out of scroll container
- the original place don't have a placeholder item there

The vue dnd has a mechanism for you to customize this behavior.

## Setup

Before add the preview, we need a container to contain the preview we want to render.

Due to css `overflow` containers,
this container is preferred to be put in the `<body>` root.

This can be done with the vue `<Teleport>`

```html{16-18,21}
<!-- app.vue-->
<template>
    <Box
        v-for="box in boxes"
        :index="box.id"
        :key="box.id"
        @drop="onDrop"
    >
        <Ball
            v-for="item in box.items"
            :key="item"
            :from="box.id"
            :index="item"
        ></Ball>
    </Box>
    <Teleport to="body">
        <DragLayer />
    </Teleport>
</template>
<script setup lang="ts">
import { DrayLayer } from '@mmis1000/vue-dnd'
/* ... */
</script>
<style>
/* ... */
</style>
```

## Add preview to drag target

And now we add drag preview to drag target

:::: code-group
::: code-group-item ts

```ts{4,20-24}
import { computed, h } from "vue";
import { useDraggable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";
import { BallPreview } from "./ball-preview";

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

const { propsItem, state } = useDraggable(
    BallType,
    computed<[string, string]>(() => [props.index, props.from]),
    {
        preview: () => {
            return h(BallPreview, { index: props.index })
        }
    }
);
```

:::
::: code-group-item tsx

```ts{4,20-24}
import { computed } from "vue";
import { useDraggable } from '@mmis1000/vue-dnd';
import { BallType } from "./type";
import { BallPreview } from "./ball-preview";

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

const { propsItem, state } = useDraggable(
    BallType,
    computed<[string, string]>(() => [props.index, props.from]),
    {
        preview: () => {
            return <BallPreview index={props.index} />
        }
    }
);
```

:::
::::

The preview can be in whatever component you wish,
but it must not cause side effect because it may be re-rendered at any time.

## Result

<example-wrapper
    title="example"
    source="https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleCustomPreview/App.vue"
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
<example-custom-preview-app :provider="provider"></example-custom-preview-app>
</template>
</example-wrapper>
