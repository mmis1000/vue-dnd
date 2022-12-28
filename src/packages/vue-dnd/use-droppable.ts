import { cloneVNode, computed, inject, reactive, Ref, unref, VNode } from "vue"
import { DndProvider, DroppableDecoratorOptions } from "./interfaces"
import { DropType, matchAccept, myMergeProps, PROVIDER_INJECTOR_KEY, UnwrapDragDropType } from "./internal"
import { Default } from "./types"

interface DropHookOptions<ItemType extends DropType<any>> extends DroppableDecoratorOptions<ItemType> {
}
export const useDroppable = <ItemType extends DropType<any> = typeof Default>(

  accept: DroppableDecoratorOptions<ItemType>['accept'],
  options: Pick<DropHookOptions<ItemType>, Exclude<keyof DropHookOptions<ItemType>, 'accept'>> = {}
) => {
  const provider = inject(PROVIDER_INJECTOR_KEY) as DndProvider | undefined

  if (provider == null) {
    throw new Error('[vue-dnd] useDroppable must be used with a provider')
  }

  const [id, getProps] = provider.useDroppableDecorator({ accept, ...options })

  const wrapItem = <T, U, V extends { [key: string]: any; }>(node: VNode<T, U, V>): VNode<T, U, V> => cloneVNode(node, getProps(), true) as any
  const propsItem = <T extends Record<string, any>>(extra?: T) => extra == null ? getProps() : myMergeProps(extra, getProps())

  const hoverComputed = computed(() => provider.readonlyExecutions.find(execution => execution.targets.indexOf(id) >= 0) != null)
  const draggingItems = computed(() => {
    const mapped = provider.readonlyExecutions.map(execution => {
      const accepted = computed(() => {
        return matchAccept(accept, execution.initialDragEvent, execution)
      })
      return {
        hover: execution.targets.indexOf(id) >= 0,
        data: unref(execution.data) as UnwrapDragDropType<ItemType>,
        get accepted() {
          return accepted.value
        }
      }
    })
    return mapped
  })

  return {
    wrapItem: <T, U, V extends { [key: string]: any; }>(node: VNode<T, U, V>): VNode<T, U, V> => {
      if (options.disabled == null || !unref(options.disabled)) {
        return wrapItem(node)
      } else {
        return node
      }
    },
    propsItem: <T extends Record<string, any>>(extra?: T) => {
      if (options.disabled == null || !unref(options.disabled)) {
        return propsItem(extra)
      } else {
        return extra as Record<string, any>
      }
    },
    hoverState: reactive({
      hover: hoverComputed,
      draggingItems: draggingItems
    })
  }
}