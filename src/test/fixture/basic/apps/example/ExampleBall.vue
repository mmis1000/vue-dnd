<script lang="tsx">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageType } from "./exampleType";
import { defineComponent, computed } from "vue";
import { useDraggable } from "../../../../../packages/vue-dnd";
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
    useCustomPreview: {
      type: Boolean,
      default: false,
    },
    isPreview: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    // propsItem is a function that return required attribute during the rendering
    const { propsItem, state } = useDraggable(
      MessageType,
      // Specify what did you want to send to the dropzone, can either be ref or raw value
      computed(() => [props.currentBucket, props.id] as [number, number]),
      {
        // option for disable the whole hook
        disabled: props.isPreview,
        // optional handlers
        onDragStart: (ev, data) => {},
        preview: props.useCustomPreview ? (() => <ExampleBall {...props} isPreview={true} />) : undefined,
      }
    );

    return () => (
      // use the propsItem here
      <div id={'ball-' + String(props.id)} class="ball" style={{ 'opacity': state.isDragging ? '0.5' : '1' }} {...propsItem.value}>
        {props.isPreview ? 'preview' : props.id}
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
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>