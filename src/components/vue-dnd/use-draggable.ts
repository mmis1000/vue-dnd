import { inject, VNode } from "vue"
import { nuzz, PROVIDER_INJECTOR_KEY } from "./internal"

export const useDraggable = (
  data: any,
  options: {
    onDragStart?: (ev: DragEvent) => void
  }
) => {
  const provider = inject(PROVIDER_INJECTOR_KEY)

  if (provider == null) {
    throw new Error('missing provider')
  }

  return {
    wrap (node: VNode) {
      return provider.decorateDraggable(node, {
        onDragStart: options.onDragStart
      }, data)
    }
  }
}
