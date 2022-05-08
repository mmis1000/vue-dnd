import { cloneVNode, computed, inject, mergeProps, reactive, unref, VNode } from "vue"
import { DndDragHandlerWithData, DndProvider } from "./interfaces"
import { matchAccept, PROVIDER_INJECTOR_KEY } from "./internal"

export const useDroppable = <IData = unknown>(options: {
  accept: IData | ((arg: IData) => boolean)
  onDrop?: DndDragHandlerWithData<IData>
  onDragOver?: DndDragHandlerWithData<IData>
  onDragEnter?: DndDragHandlerWithData<IData>
  onDragLeave?: DndDragHandlerWithData<IData>
}) => {
  const provider = inject(PROVIDER_INJECTOR_KEY) as DndProvider<IData> | undefined

  if (provider == null) {
    throw new Error('[vue-dnd] useDroppable must be used with a provider')
  }

  const [id, getProps] = provider.getDroppableDecorator(options.accept, {
    onDrop: options.onDrop,
    onDragEnter: options.onDragEnter,
    onDragLeave: options.onDragLeave,
    onDragOver: options.onDragOver
  })

  const wrapItem = <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> => cloneVNode(node, getProps(), true) as any
  const propsItem = <T extends Record<string, any>>(extra?: T) => extra == null ? getProps() : mergeProps(extra, getProps())

  const hoverComputed = computed(() => provider.readonlyExecutions.find(execution => execution.targets.indexOf(id) >= 0) != null)
  const draggingItems = computed(() => {
    const mapped = provider.readonlyExecutions.map(execution => {
      const accepted = computed(() => {
        return matchAccept(options.accept, unref<IData>(execution.data))
      })
      return {
        hover: execution.targets.indexOf(id) >= 0,
        data: unref<IData>(execution.data),
        get accepted() {
          return accepted.value
        }
      }
    })
    return mapped
  })

  return {
    wrapItem,
    propsItem,
    hoverState: reactive({
      hover: hoverComputed,
      draggingItems: draggingItems
    })
  }
}