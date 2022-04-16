<script lang="tsx">
import { Message } from "./exampleType";
import { defineComponent, computed } from "vue";
import { useDraggableWithHandle } from "../../packages/vue-dnd";
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
    const { propsItem, propsHandle } = useDraggableWithHandle<Message>(
      // Specify what did you want to send to the dropzone, can either be ref or raw value
      computed(() => [props.currentBucket, props.id] as Message),
      {}
    );

    return () => {
      return (
        <div class="box" {...propsItem()}>
          <div class="box-content" {...propsHandle({})}>
            Handle
          </div>
          {props.id}
        </div>
      );
    };
  },
});
</script>
<style scoped>
.box {
  margin: 10px;
  height: 50px;
  background: red;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
}

.box-content {
  background: green;
  border-radius: 10px;
}
</style>