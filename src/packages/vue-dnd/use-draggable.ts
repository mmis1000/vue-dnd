import { computed, ComputedRef, inject, reactive, Ref, VNode } from "vue"
import { DndDragHandlerWithData } from "./interfaces"
import { PROVIDER_INJECTOR_KEY } from "./internal"

export const useDraggable = <IData = unknown>(
  data: IData | Ref<IData> | ComputedRef<IData>,
  options: {
    onDragStart?: DndDragHandlerWithData<IData>
  }
) => {
  const provider = inject(PROVIDER_INJECTOR_KEY)

  if (provider == null) {
    throw new Error('missing provider')
  }

  const [id, wrap] = provider.getDraggableDecorator({
    onDragStart: options.onDragStart
  }, data)

  return {
    wrap(node: VNode) {
      return wrap(node)
    },
    state: reactive({
      isDragging: computed(() => provider.readonlyExecutions.find(exe => exe.source === id))
    })
  }
}
