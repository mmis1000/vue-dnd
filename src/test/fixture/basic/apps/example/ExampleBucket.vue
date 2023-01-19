<script lang="tsx">
import { MessageType } from "./exampleType";
import { defineComponent, PropType, ref } from "vue";
import { useDroppable } from "../../../../../packages/vue-dnd";
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
    const disabled = ref(false)
    const { propsItem, hoverState } = useDroppable(
      // Declare whether you want to receive the draggable item or not
      // A predicate function or raw value
      MessageType.withFilter((msg) => msg[0] !== props.id),
      {
        disabled,
        // The drop zone receives message from draggable item
        onDrop: (ev, data) => {
          props.onDrop(data[1], data[0], props.id);
        },
      }
    );


    return () => (
      <div
        id={'bucket-' + String(props.id)}
        class={{
          bucket: true,
          hover: hoverState.hover,
          disabled: disabled.value
        }}
        {...propsItem.value}
      >
        <label><input type="checkbox" onChange={(e) => { disabled.value = (e.target as HTMLInputElement).checked }} data-disabled={disabled.value} /> disabled</label>
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

.disabled {
  border-color: red;
}
</style>