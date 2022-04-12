import { computed, inject, reactive, ref, shallowReactive, VNode } from "vue"
import { PROVIDER_INJECTOR_KEY } from "./internal"

export const useDroppable = <IData, T>(options: {
  accept?: IData | ((arg: IData) => boolean)
  getComputedState?: (state: {
    hover: boolean,
    draggingItems: { hover: boolean, accepted: boolean, data: any }[]
  }) => T
  onDrop?: (ev: DragEvent, data: any) => void
  onDragOver?: (ev: DragEvent, data: any) => void
}) => {
  const provider = inject(PROVIDER_INJECTOR_KEY)

  if (provider == null) {
    throw new Error('missing provider')
  }

  const matchAccept = (accept: any, data: any) => {
    if (typeof accept === 'function') {
      if (accept(data)) {
        return true
      }
    } else {
      if (accept === data) {
        return true
      }
    }
    return false
  }

  const [id, decorateElement] = provider.getDroppableDecorator({
    onDrop: (ev, data) => {
      options.onDrop?.(ev, data)
    },
    onDragEnter: (ev) => {
    },
    onDragLeave: (ev) => {
    },
    onDragOver: (ev, data) => {
      if (options.accept != null) {
        if (matchAccept(options.accept, data)) {
          ev.preventDefault()
        }
      }
      options.onDragOver?.(ev, data)
    }
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
        get accepted () {
          return accepted.value
        }
      }
    })
    return mapped
  })

  return {
    wrap (node: VNode) {
      return decorateElement(node)
    },
    computedState: computed(() => {
      if (options.getComputedState == null) {
        throw new Error('no computed state')
      }
      return options.getComputedState({
        get hover () {
          return hoverComputed.value
        },
        get draggingItems () {
          return draggingItems.value
        }
      })
    })
  }
}