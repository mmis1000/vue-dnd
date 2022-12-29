<script lang="tsx">
import { MessageType } from "./exampleType";
import { defineComponent, computed, ref } from "vue";
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
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:disabled'],
  setup(props, { emit }) {
    const disabled = computed({
      get: () => props.disabled,
      set: (v) => { emit('update:disabled', v) }
    })
    const { propsItem, propsHandle } = useDraggableWithHandle(
      MessageType,
      computed(() => [props.currentBucket, props.id] as [number, number]),
      {
        disabled
      }
    );

    return () => {
      return (
        <div class={{
          box: true,
          disabled: disabled.value
        }} {...propsItem({})}>
          <div class="box-content" {...propsHandle({})}>
            Handle
          </div>
          {props.id}<br />
          <label>
            <input
              type="checkbox"
              onChange={(e) => { disabled.value = (e.target as HTMLInputElement).checked }}
            />
            disabled
          </label>
        </div>
      );
    };
  },
});
</script>
<style scoped>
.box {
  margin: 10px;
  background: red;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
}
.box.disabled {
  background: gray;
}

.box-content {
  background: green;
  border-radius: 10px;
}
</style>