# Vue Dnd

Status: WIP, DON'T USE

An un-opinionated drag and drop help utility.  
It doesn't care about how you store the data or how you update the data.  
All it does is sending the message from draggable to drop zone for you.

## API

Usage

```ts
import { defineComponent, PropType, reactive, computed } from "vue";
import { useDraggable, useDroppable, useHtmlProvider, usePointerEventProvider } from "@mmis1000/vue-dnd";

type Message = [currentBucket: number, id: number];

const Ball = defineComponent({
  props: {
    currentBucket: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    // propsItem is a function that return required attribute during the rendering
    const { propsItem } = useDraggable<Message>(
      // Specify what did you want to send to the drop zone, can either be ref or raw value
      computed(() => [props.currentBucket, props.id] as Message),
      {
        // optional handlers
        onDragStart: (ev, data) => {},
      }
    );

    return () => (
      // use the propsItem here
      <div class="ball" {...propsItem()}>
        {props.id}
      </div>
    );
  },
});

const Bucket = defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
    onDrop: {
      type: Function as PropType<
        (item: number, oldBucket: number, newBucket: number) => void
      >,
      required: true,
    },
  },
  setup(props, ctx) {
    // propsItem is a function that return required attribute during the rendering
    const { propsItem, hoverState } = useDroppable<Message>({
      // Declare whether you want to receive the draggable item or not
      // A predicate function or raw value
      accept: (msg) => msg[0] !== props.id,
      // The drop zone receives message from draggable item
      onDrop: (ev, data) => {
        // Tell the parent that something dropped
        props.onDrop(data[1], data[0], props.id);
      },
      // optional handlers
      onDragOver: (ev, data) => {},
      onDragEnter: (ev, data) => {},
      onDragLeave: (ev, data) => {},
    });

    return () => (
      <div
        class={hoverState.hover ? "bucket hover" : "bucket"}
        // use the propsItem here
        {...propsItem()}
      >
        {ctx.slots.default?.()}
      </div>
    );
  },
});

export default defineComponent({
  props: {
    usePointerEvent: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    if (props.usePointerEvent) {
    // init the context and pointer event implementation
      usePointerEventProvider();
    } else {
    // or the context and html5 drag implementation
      useHtmlProvider();
    }

    const buckets = reactive(new Array(5).fill(null).map(() => [] as number[]));
    buckets[0].push(1, 2, 3, 4, 5);

    // update the data when received message
    const onDrop = (id: number, oldBucket: number, newBucket: number) => {
      console.log(id, oldBucket, newBucket);
      buckets[oldBucket] = buckets[oldBucket].filter((i) => i !== id);
      buckets[newBucket] = buckets[newBucket].concat([id]);
    };

    return () => (
      <div class="board">
        {buckets.map((b, index) => (
          <Bucket id={index} key={index} onDrop={onDrop}>
            {b.map((i, index2) => (
              <Ball id={i} currentBucket={index} key={index2} />
            ))}
          </Bucket>
        ))}
      </div>
    );
  },
});
```
