<script lang="tsx">
import { Message } from "./exampleType";
import { defineComponent, computed } from "vue";
import { useDraggable } from "../../packages/vue-dnd";
const ExampleBall = defineComponent({
  props: {
    currentBucket: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    isPreview: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    // propsItem is a function that return required attribute during the rendering
    const { propsItem, state } = !props.isPreview ? useDraggable<Message>(
      // Specify what did you want to send to the dropzone, can either be ref or raw value
      computed(() => [props.currentBucket, props.id] as Message),
      {
        // optional handlers
        onDragStart: (ev, data) => {},
        preview: () => <ExampleBall {...props} />,
      }
    ) : { propsItem: () => ({}), state: undefined };

    return () => (
      // use the propsItem here
      <div class="ball" style={{ 'opacity': state?.isDragging ? '0.5' : '1' }} {...propsItem()}>
        {props.id}
      </div>
    );
  },
});
export { ExampleBall as default }
</script>
<style scoped>
.ball {
  width: 50px;
  height: 50px;
  background: red;
  border-radius: 50%;
}
</style>