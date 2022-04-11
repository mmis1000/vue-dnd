import { computed, inject, ref, VNode } from "vue"
import { PROVIDER_INJECTOR_KEY } from "./internal"

export const useDroppable = <T = never>(options: {
  getComputedState?: (state: {
    hover: boolean
  }) => T
  onDrop?: (ev: DragEvent, data: any) => void
  onDragOver?: (ev: DragEvent, data: any) => void
}) => {
  const provider = inject(PROVIDER_INJECTOR_KEY)

  if (provider == null) {
    throw new Error('missing provider')
  }

  let hovering = ref(false)

  return {
    wrap (node: VNode) {
      return provider.argumentDroppable(node, {
        onDrop: (ev, data) => {
          hovering.value = false
          options.onDrop?.(ev, data)
        },
        onDragEnter: (ev) => {
          console.log(ev)
          hovering.value = true
        },
        onDragLeave: (ev) => {
          console.log(ev)
          hovering.value = false
        },
        onDragOver: (ev, data) => {
          if (options.onDragOver == null) {
            ev.preventDefault()
          } else {
            options.onDragOver(ev, data)
          }
        }
      })
    },
    computedState: computed(() => {
      if (options.getComputedState == null) {
        throw new Error('no computed state')
      }
      return options.getComputedState({ hover: hovering.value })
    })
  }
}