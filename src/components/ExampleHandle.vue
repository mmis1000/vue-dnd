<script lang="tsx">
import { defineComponent, reactive } from "vue";
import { useHtmlProvider } from "../packages/vue-dnd/use-html-provider";
import { usePointerEventProvider } from "../packages/vue-dnd/use-pointer-event-provider";
import ExampleItemWithHandleVue from "./example/ExampleItemWithHandle.vue";
import ExampleBucketVue from "./example/ExampleBucket.vue";
import ExampleBoardVue from "./example/ExampleBoard.vue";

const Ball = ExampleItemWithHandleVue
const Bucket = ExampleBucketVue
const Board = ExampleBoardVue

export default defineComponent({
  props: {
    usePointerEvent: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    if (props.usePointerEvent) {
      usePointerEventProvider();
    } else {
      useHtmlProvider();
    }

    const disabledItems = reactive(new Set<number>())

    const buckets = reactive(new Array(5).fill(null).map(() => [] as number[]));
    buckets[0].push(1, 2, 3, 4, 5);

    const onDrop = (id: number, oldBucket: number, newBucket: number) => {
      console.log(id, oldBucket, newBucket);
      buckets[oldBucket] = buckets[oldBucket].filter((i) => i !== id);
      buckets[newBucket] = buckets[newBucket].concat([id]);
    };

    return () => (
      <Board>
        {buckets.map((b, index) => (
          <Bucket id={index} key={index} onDrop={onDrop}>
            {b.map((i) => (
              <Ball
                id={i}
                currentBucket={index}
                key={i}
                disabled={disabledItems.has(i)}
                onUpdate:disabled={(v: boolean) => v ? disabledItems.add(i) : disabledItems.delete(i)}
              />
            ))}
          </Bucket>
        ))}
      </Board>
    );
  },
});
</script>