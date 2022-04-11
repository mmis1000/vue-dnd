<script lang="tsx">
import { useDroppable } from "./vue-dnd/use-droppable"
export default {
  props: {
    index: Number
  },
  setup (props: {index: number}) {
    const { wrap, computedState } = useDroppable<Record<string, any>>({
      getComputedState(state) {
        return state.hover ? { background: 'red'} : { background: 'blue' }
      },
      onDrop(ev, data) {
        console.log(
          ev,
          data,
          ev.dataTransfer?.getData("text"),
          ev.dataTransfer?.getData("application/vue-dnd")
        )
      },
      onDragOver(ev, data) {
        console.log('umm', ev, data, props.index)
        if (data !== props.index) {
          console.log(ev)
          ev.preventDefault()
        }
      }
    })
    return () => wrap(<div class="a" style={computedState.value}/>)
  }
}
</script>

<style scoped>
.a {
  width: 200px;
  height: 200px;
  background-color: #2c3e50;
}
</style>
