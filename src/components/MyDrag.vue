<script lang="tsx">
import { useDraggable } from "./vue-dnd/use-draggable"
export default {
  props: {
    index: Number
  },
  setup (props: {index: number}) {
    const { wrap } = useDraggable(props.index, {
      onDragStart (ev) {
        console.log(ev)
      }
    })
    return () => wrap(<div class="a"/>)
  }
}
</script>

<style scoped>
.a {
  width: 100px;
  height: 100px;
  background-color: #2c3e50;
}
</style>
