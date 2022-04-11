<script lang="tsx">
import { defineComponent } from "vue"
import { useDraggable } from "./vue-dnd/use-draggable"
export default defineComponent({
  props: {
    index: Number
  },
  setup (props, ctx) {
    const { wrap } = useDraggable(props.index, {
      onDragStart (ev) {
        console.log(ev)
      }
    })
    return () => wrap(<div class="a">
      {ctx.slots.default?.()}
    </div>)
  }
})
</script>

<style scoped>
.a {
  width: 100px;
  height: 100px;
  background-color: #2c3e50;
}
</style>
