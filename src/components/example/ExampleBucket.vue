<script lang="tsx">
import { MessageType } from "./exampleType";
import { defineComponent, PropType } from "vue";
import { useDroppable } from "../../packages/vue-dnd";
export default defineComponent({
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
    const { propsItem, hoverState } = useDroppable({
      // Declare whether you want to receive the draggable item or not
      // A predicate function or raw value
      accept: MessageType.withFilter((msg) => msg[0] !== props.id),
      // The drop zone receives message from draggable item
      onDrop: (ev, data) => {
        props.onDrop(data[1], data[0], props.id);
      },
    });

    return () => (
      <div
        {...propsItem({ class: hoverState.hover ? "bucket hover" : "bucket" })}
      >
        {ctx.slots.default?.()}
      </div>
    );
  },
});

</script>
<style scoped>
.bucket {
  width: 200px;
  border: 4px solid blue;
}

.hover {
  background: #ccc;
}
</style>