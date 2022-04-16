<script lang="tsx">
import { defineComponent, reactive } from "vue";
import { useHtmlProvider } from "../packages/vue-dnd/use-html-provider";
import { usePointerEventProvider } from "../packages/vue-dnd/use-pointer-event-provider";
import ExampleBallVue from "./example/ExampleBall.vue";
import ExampleBucketVue from "./example/ExampleBucket.vue";
import ExampleBoardVue from "./example/ExampleBoard.vue";

const Ball =  ExampleBallVue
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
      <Board>
        {buckets.map((b, index) => (
          <Bucket id={index} key={index} onDrop={onDrop}>
            {b.map((i, index2) => (
              <Ball id={i} currentBucket={index} key={index2} />
            ))}
          </Bucket>
        ))}
      </Board>
    );
  },
});
</script>