<script lang="tsx">
import { defineComponent, PropType } from "vue"
import { useDroppable } from "./vue-dnd/use-droppable"
export default defineComponent({
  props: {
    index: {
      type: Array as unknown as PropType<[number, number]>,
      required: true
    },
    dark: Boolean
  },
  emits: ["drop"],
  setup (props, ctx) {
    const { wrap, computedState } = useDroppable<[number, number], Record<string, any>>({
      accept: (d) => {
        if (
          Math.abs(d[0] - props.index[0]) === 1 && Math.abs(d[1] - props.index[1]) === 2 ||
          Math.abs(d[0] - props.index[0]) === 2 && Math.abs(d[1] - props.index[1]) === 1 
        ) {
          return true
        } else {
          return false
        }
      },
      getComputedState (state) {
        if (state.hover) {
          if (state.draggingItems.find( i => i.accepted) != null) {
            return { background: 'green', 'user-select': 'none' }
          } else {
            return { background: 'red', 'user-select': 'none' }
          }
        } else if (state.draggingItems.length > 0) {
          if (state.draggingItems.find( i => i.accepted) != null) {
            return { background: 'blue', 'user-select': 'none' }
          } else {
            return { 'user-select': 'none' }
          }
        } else {
          return {}
        }
      },
      onDrop: (ev, data) => {
        ctx.emit('drop', { index: props.index })
      },
      onDragOver(ev, data) {
      }
    })
    return () => wrap(<div class={props.dark ? 'a dark' : 'a'} style={computedState.value}>
      {ctx.slots.default?.()}
    </div>)
  }
})
</script>

<style scoped>
.a {
  width: 80px;
  height: 80px;
  background-color: white;
}
.a.dark {
  background-color: black;
  color: white;
}
</style>
