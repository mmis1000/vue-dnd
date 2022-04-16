<script lang="tsx">
import { Message } from "./exampleType";
import { defineComponent, computed } from "vue";
import { useDraggable } from "../../packages/vue-dnd";
export default defineComponent({
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
      // Specify what did you want to send to the dropzone, can either be ref or raw value
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

</script>
<style scoped>
.ball {
  width: 50px;
  height: 50px;
  background: red;
  border-radius: 50%;
}
</style>