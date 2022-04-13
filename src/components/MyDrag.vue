<script lang="tsx">
import { computed, defineComponent, PropType } from "vue"
import { useDraggable } from "../packages/vue-dnd/use-draggable"
export default defineComponent({
  props: {
    index: {
      type: Array as unknown as PropType<[number, number]>,
      required: true
    },
    dark: Boolean
  },
  setup (props, ctx) {
    const { wrap, state } = useDraggable(computed(() => props.index), {
      onDragStart (ev) {
        console.log('start', ev)
      }
    })
    return () => wrap(<div style="color: red" class={{a: true, dark: props.dark, dragging: state.isDragging}}>
      {state.isDragging ? 'moving...' : ctx.slots.default?.()}
    </div>)
  }
})
</script>

<style scoped>
.a {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #77df82;
}
.a.dark {
  background: #31502c;
}
.a.dragging {
  user-select: none;
  opacity: 0.5;
}
</style>
