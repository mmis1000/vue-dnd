import { computed, inject, VNode } from "vue"
import { DndDragHandlerWithData } from "./interfaces"
import { matchAccept, PROVIDER_INJECTOR_KEY } from "./internal"

export const useDroppable = <IData = unknown, ComputedState = unknown>(options: {
  accept: IData | ((arg: IData) => boolean)
  getComputedState?: (state: {
    hover: boolean,
    draggingItems: { hover: boolean, accepted: boolean, data: any }[]
  }) => ComputedState
  onDrop?: DndDragHandlerWithData<IData>
  onDragOver?: DndDragHandlerWithData<IData>
  onDragEnter?: DndDragHandlerWithData<IData>
  onDragLeave?: DndDragHandlerWithData<IData>
}) => {
  const provider = inject(PROVIDER_INJECTOR_KEY)

  if (provider == null) {
    throw new Error('missing provider')
  }

  const [id, decorateElement] = provider.getDroppableDecorator(options.accept, {
    onDrop: options.onDrop,
    onDragEnter: options.onDragEnter,
    onDragLeave: options.onDragLeave,
    onDragOver: options.onDragOver
  })

  const hoverComputed = computed(() => provider.readonlyExecutions.find(execution => execution.targets.indexOf(id) >= 0) != null)
  const draggingItems = computed(() => {
    const mapped = provider.readonlyExecutions.map(execution => {
      const accepted = computed(() => {
        return matchAccept(options.accept, execution.data)
      })
      return {
        hover: execution.targets.indexOf(id) >= 0,
        data: execution.data,
        get accepted() {
          return accepted.value
        }
      }
    })
    return mapped
  })

  return {
    wrap(node: VNode) {
      return decorateElement(node)
    },
    computedState: computed(() => {
      if (options.getComputedState == null) {
        throw new Error('no computed state')
      }
      return options.getComputedState({
        get hover() {
          return hoverComputed.value
        },
        get draggingItems() {
          return draggingItems.value
        }
      })
    })
  }
}