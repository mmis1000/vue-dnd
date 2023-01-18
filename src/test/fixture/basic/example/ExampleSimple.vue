<script lang="tsx">
import { defineComponent, reactive } from "vue";
import { useHtmlProvider } from "../../../../packages/vue-dnd/use-html-provider";
import { usePointerEventProvider } from "../../../../packages/vue-dnd/use-pointer-event-provider";
import ExampleBallVue from "./ExampleBall.vue";
import ExampleBucketVue from "./ExampleBucket.vue";
import ExampleBoardVue from "./ExampleBoard.vue";
import { DragLayer } from "../../../../packages/vue-dnd/DragLayer";

const Ball =  ExampleBallVue
const Bucket = ExampleBucketVue
const Board = ExampleBoardVue

export default defineComponent({
  props: {
    usePointerEvent: {
      type: Boolean,
      default: false,
    },
    useCustomPreview: {
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

    const buckets = reactive(new Array(2).fill(null).map(() => [] as number[]));
    buckets[0].push(0, 1, 2);

    // update the data when received message
    const onDrop = (id: number, oldBucket: number, newBucket: number) => {
      console.log(id, oldBucket, newBucket);
      buckets[oldBucket] = buckets[oldBucket].filter((i) => i !== id);
      buckets[newBucket] = buckets[newBucket].concat([id]);
    };

    return () => (
      <>
        <Board>
          {buckets.map((b, index) => (
            <Bucket id={index} key={index} onDrop={onDrop}>
              {b.map((i) => (
                <Ball id={i} currentBucket={index} key={i} useCustomPreview={props.useCustomPreview} />
              ))}
            </Bucket>
          ))}
        </Board>
        <DragLayer />
      </>
    );
  },
});
</script>