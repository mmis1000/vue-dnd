<script lang="tsx">
import { defineComponent, PropType } from "vue"
import { useDraggable } from "./vue-dnd/use-draggable"
export default defineComponent({
  props: {
    index: {
      type: Array as unknown as PropType<[number, number]>,
      required: true
    },
    dark: Boolean
  },
  setup (props, ctx) {
    const { wrap } = useDraggable(props.index, {
      onDragStart (ev) {
      }
    })
    return () => wrap(<div class={props.dark ? 'a dark' : 'a'}>
      {ctx.slots.default?.()}
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
</style>
