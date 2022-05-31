import { cloneVNode, computed, inject, reactive, VNode } from "vue"
import { DndProvider, DraggableDecoratorOptions, Execution } from "./interfaces"
import { DragType, myMergeProps, PROVIDER_INJECTOR_KEY } from "./internal"

interface DragHookOptions<ItemType extends DragType<any>> extends DraggableDecoratorOptions<ItemType> {
  disabled?: boolean
}
export const useDraggableWithHandle = <ItemType extends DragType<any>>(
  type: DragHookOptions<ItemType>['type'],
  data: DragHookOptions<ItemType>['data'],
  options: Pick<DragHookOptions<ItemType>, Exclude<keyof DragHookOptions<ItemType>, 'type' | 'data'>> = {}
): {
  propsItem: (originalProps?: Record<string, any>) => Record<string, any>
  propsHandle: (originalProps?: Record<string, any>) => Record<string, any>
  wrapItem: { <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> }
  wrapHandle: { <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> }
  state: {
    isDragging: Execution<ItemType> | undefined
  }
} => {
  if (options.disabled === true) {
    return {
      propsItem: (originalProps?: Record<string, any>) => (originalProps ?? {}),
      propsHandle: (originalProps?: Record<string, any>) => (originalProps ?? {}),
      wrapItem: node => node,
      wrapHandle: node => node,
      state: {
        isDragging: undefined
      }
    }
  }
  const provider = inject(PROVIDER_INJECTOR_KEY) as DndProvider | undefined

  if (provider == null) {
    throw new Error('[vue-dnd] useDraggableWithHandle must be used with a provider')
  }

  const [id, getProps, getHandleProps] = provider.useDraggableDecorator({
    type: type,
    data: data,
    onDragStart: options.onDragStart,
    preview: options.preview,
    startDirection: options.startDirection
  })

  const wrapItem = <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> => cloneVNode(node, getProps(), true) as any
  const wrapHandle = <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> => cloneVNode(node, getHandleProps(), true) as any

  const propsItem = <T extends Record<string, any>>(extra?: T) => extra == null ? getProps() : myMergeProps(extra, getProps())
  const propsHandle = <T extends Record<string, any>>(extra?: T) => extra == null ? getHandleProps() : myMergeProps(extra, getHandleProps())

  return {
    propsItem,
    propsHandle,
    wrapItem,
    wrapHandle,
    state: reactive({
      isDragging: computed(() =>
        // because only execution triggered from this hook will have same id with id here, this cast should be safe
        provider.readonlyExecutions.find(exe => exe.source === id) as unknown as Execution<ItemType> | undefined
      )
    })
  }
}

export const useDraggable = <ItemType extends DragType<any>>(
  type: DragHookOptions<ItemType>['type'],
  data: DragHookOptions<ItemType>['data'],
  options?: Pick<DragHookOptions<ItemType>, Exclude<keyof DragHookOptions<ItemType>, 'type' | 'data'>>
): {
  propsItem: (originalProps?: Record<string, any>) => Record<string, any>
  wrapItem: { <T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> }
  state: {
    isDragging: Execution<ItemType> | undefined
  }
} => {
  const { wrapItem, wrapHandle, propsItem, propsHandle, state } = useDraggableWithHandle(type, data, options)
  const mergeProps = <T extends Record<string, any>>(extra?: T) => propsItem(propsHandle(extra))
  return {
    propsItem: mergeProps,
    wrapItem<T, U, V>(node: VNode<T, U, V>): VNode<T, U, V> {
      return wrapHandle(wrapItem(node))
    },
    state
  }
}