<script lang="tsx">
import { defineComponent } from "vue"
import { useDroppable } from "./vue-dnd/use-droppable"
export default defineComponent({
  props: {
    index: String,
    dark: Boolean
  },
  emits: ["drop"],
  setup (props, ctx) {
    const { wrap, computedState } = useDroppable<Record<string, any>>({
      getComputedState(state) {
        return state.hover ? { background: 'red'} : {}
      },
      onDrop: (ev, data) => {
        ctx.emit('drop', { index: props.index })
      },
      onDragOver(ev, data) {
        if (data !== props.index) {
          ev.preventDefault()
        }
      }
    })
    return () => wrap(<div class={props.dark ? 'a' : 'a dark'} style={computedState.value}>
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
}
</style>
