<script lang="tsx">
import { defineComponent } from "vue"
import { useDroppable } from "./vue-dnd/use-droppable"
export default defineComponent({
  props: {
    index: Number
  },
  emits: ["drop"],
  setup (props, ctx) {
    const { wrap, computedState } = useDroppable<Record<string, any>>({
      getComputedState(state) {
        return state.hover ? { background: 'red'} : { background: 'blue' }
      },
      onDrop: (ev, data) => {
        ctx.emit('drop', { index: props.index })
      },
      onDragOver(ev, data) {
        console.log('umm', ev, data, props.index)
        if (data !== props.index) {
          console.log(ev)
          ev.preventDefault()
        }
      }
    })
    return () => wrap(<div class="a" style={computedState.value}>
      {ctx.slots.default?.()}
    </div>)
  }
})
</script>

<style scoped>
.a {
  width: 200px;
  height: 200px;
  background-color: #2c3e50;
}
</style>
