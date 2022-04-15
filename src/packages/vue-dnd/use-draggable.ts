import { computed, ComputedRef, inject, reactive, Ref, VNode } from "vue"
import { DndDragHandlerWithData, DndProvider } from "./interfaces"
import { PROVIDER_INJECTOR_KEY } from "./internal"

export const useDraggableWithHandle = <IData = unknown>(
  data: IData | Ref<IData> | ComputedRef<IData>,
  options: {
    onDragStart?: DndDragHandlerWithData<IData>
  }
) => {
  const provider = inject(PROVIDER_INJECTOR_KEY) as DndProvider<IData> | undefined

  if (provider == null) {
    throw new Error('missing provider')
  }

  const [id, wrap, wrapHandle] = provider.getDraggableDecorator({
    onDragStart: options.onDragStart
  }, data)

  return {
    wrap,
    wrapHandle,
    state: reactive({
      isDragging: computed(() => provider.readonlyExecutions.find(exe => exe.source === id))
    })
  }
}
export const useDraggable = <IData = unknown>(
  data: IData | Ref<IData> | ComputedRef<IData>,
  options: {
    onDragStart?: DndDragHandlerWithData<IData>
  }
) => {
  const { wrap, wrapHandle, state } = useDraggableWithHandle(data, options)

  return {
    wrap(node: VNode) {
      return wrapHandle(wrap(node))
    },
    state
  }
}