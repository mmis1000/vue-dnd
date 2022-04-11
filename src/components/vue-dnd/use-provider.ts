import { provide, RendererElement, RendererNode, VNode } from "vue";
import { DND_PROVIDER } from "./interfaces";
import { PROVIDER_INJECTOR_KEY } from "./internal";

let instanceId = 0

const prefix = 'application/vue-dnd'

const getId = (ev: DragEvent) => {
  const target = ev.dataTransfer?.types.find(i =>  i.startsWith(prefix))
  return target ? target.slice(prefix.length + 1) : null
}

class Provider implements DND_PROVIDER {
  private currentInstanceId = instanceId++
  private dragEventIndex = 0
  private dataMap = new Map<string, any>()
  argumentDraggable<T, U, V>(
    node: VNode<T, U, V>,
    events: { onDragStart?: ((ev: DragEvent) => void) | undefined; },
    data: any
  ): VNode<T, U, V> {
    return {
      ...node,
      props: {
        ...node.props,
        draggable: 'true',
        onDragstart: (ev:DragEvent) => {
          const id = (this.currentInstanceId + '.' + this.dragEventIndex++)
          this.dataMap.set(id, data)
          ev.dataTransfer!.setData('text/plain', '')
          ev.dataTransfer!.setData(prefix + '-' + id, '')
          events.onDragStart?.(ev)
        },
        onDragend: (ev:DragEvent) => {
          const id = getId(ev)
          if (id != null) {
            this.dataMap.delete(id)
          }
        }
      }
    } as any
  }
  argumentDroppable<T, U, V>(
    node: VNode<T, U, V>,
    events: {
      onDragOver?: ((ev: DragEvent, data: any) => void) | undefined;
      onDragEnter?: ((ev:DragEvent) => void) | undefined;
      onDragLeave?: ((ev:DragEvent) => void) | undefined;
      onDrop?: ((ev:DragEvent, data: any) => void) | undefined;
    }
  ): VNode<T, U, V> {
      return {
        ...node,
        props: {
          ...node.props,
          onDrop: (ev: DragEvent) => {
            const id = getId(ev)
            if (id === null) {
              ev.preventDefault()
              return
            }
            const data = this.dataMap.get(id)
            this.dataMap.delete(id)
            events.onDrop?.(ev, data)
          },
          onDragenter: events.onDragEnter,
          onDragleave: events.onDragLeave,
          onDragover: (ev: DragEvent) => {
            const id = getId(ev)
            if (id === null) {
              return
            }
            const data = this.dataMap.get(id)
            events.onDragOver?.(ev, data)
          }
        }
      } as any
  }
}

export const useProvider = () => {
  provide(PROVIDER_INJECTOR_KEY, new Provider())
}