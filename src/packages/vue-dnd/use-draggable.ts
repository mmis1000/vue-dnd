import { cloneVNode, computed, ComputedRef, inject, mergeProps, reactive, Ref, VNode } from "vue"
import { DndDragHandlerWithData, DndProvider, Execution } from "./interfaces"
import { PROVIDER_INJECTOR_KEY } from "./internal"

export const useDraggableWithHandle = <IData = unknown>(
  data: IData | Ref<IData> | ComputedRef<IData>,
  options: {
    disabled?: boolean
    preview?: () => VNode<any, any, any>
    onDragStart?: DndDragHandlerWithData<IData>
  }
): {
  propsItem: (originalProps?: Record<string, any>) => Record<string, any>
  propsHandle: (originalProps?: Record<string, any>) => Record<string, any>
  wrapItem: { <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> }
  wrapHandle: { <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> }
  state: {
    isDragging: Execution<IData> | undefined
  }
} => {
  if (options.disabled === true) {
    return {
      propsItem: () => ({}),
      propsHandle: () => ({}),
      wrapItem: node => node,
      wrapHandle: node => node,
      state: {
        isDragging: undefined
      }
    }
  }
  const provider = inject(PROVIDER_INJECTOR_KEY) as DndProvider<IData> | undefined

  if (provider == null) {
    throw new Error('[vue-dnd] useDraggableWithHandle must be used with a provider')
  }

  const [id, getProps, getHandleProps] = provider.getDraggableDecorator({
    onDragStart: options.onDragStart
  }, data, options.preview)

  const wrapItem = <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> => cloneVNode(node, getProps(), true) as any
  const wrapHandle = <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> => cloneVNode(node, getHandleProps(), true) as any

  const propsItem = <T extends Record<string, any>>(extra?: T) => extra == null ? getProps() : mergeProps(extra, getProps())
  const propsHandle = <T extends Record<string, any>>(extra?: T) => extra == null ? getHandleProps() : mergeProps(extra, getHandleProps())

  return {
    propsItem,
    propsHandle,
    wrapItem,
    wrapHandle,
    state: reactive({
      isDragging: computed(() => provider.readonlyExecutions.find(exe => exe.source === id))
    })
  }
}
export const useDraggable = <IData = unknown>(
  data: IData | Ref<IData> | ComputedRef<IData>,
  options: {
    disabled?: boolean
    preview?: () => VNode<any, any, any>,
    onDragStart?: DndDragHandlerWithData<IData>
  }
): {
  propsItem: (originalProps?: Record<string, any>) => Record<string, any>
  wrapItem: { <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> }
  state: {
    isDragging: Execution<IData> | undefined
  }
} => {
  const { wrapItem, wrapHandle, propsItem, propsHandle, state } = useDraggableWithHandle(data, options)
  const mergeProps = <T extends Record<string, any>>(extra?: T) => propsItem(propsHandle(extra))
  return {
    propsItem: mergeProps,
    wrapItem<T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> {
      return wrapHandle(wrapItem(node))
    },
    state
  }
}