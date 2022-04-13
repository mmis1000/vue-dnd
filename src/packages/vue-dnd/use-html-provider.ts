import { ComputedRef, provide, reactive, Ref, shallowReactive, shallowReadonly, unref, VNode } from "vue";
import { DndProvider, DndDragHandlerWithData, DragDropTargetIdentifier, Execution } from "./interfaces";
import { matchAccept, PROVIDER_INJECTOR_KEY } from "./internal";

let instanceId = 0

const prefix = 'application/vue-dnd'

const getId = (ev: DragEvent) => {
  const target = ev.dataTransfer?.types.find(i => i.startsWith(prefix))
  return target ? target.slice(prefix.length + 1) : null
}

const findAndRemove = <T>(arr: T[], predicate: (arg: T) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const hit = predicate(arr[i])
    if (hit) {
      arr.splice(i, 1)
    }
  }
}
class HtmlExecutionImpl<T> implements Execution<T> {

  readonly targets: DragDropTargetIdentifier[] = reactive([])
  constructor(
    readonly id: string,
    readonly data: T | Ref<T> | ComputedRef<T>,
    readonly source: DragDropTargetIdentifier,
    readonly movingElement: HTMLElement
  ) {
    return shallowReactive(this)
  }
}

class HtmlProvider<IData> implements DndProvider<IData> {
  private currentInstanceId = instanceId++
  private dragEventIndex = 0
  private dropTargetId = 0
  private dragTargetId = 0
  private executions: HtmlExecutionImpl<IData>[] = shallowReactive<HtmlExecutionImpl<IData>[]>([])

  readonly readonlyExecutions = shallowReadonly(this.executions)

  getDraggableDecorator<T, U, V>(
    events: { onDragStart?: DndDragHandlerWithData<IData>; },
    dataOrRef: IData | Ref<IData> | ComputedRef<IData>
  ): [DragDropTargetIdentifier, (node: VNode<T, U, V>) => VNode<T, U, V>] {
    const dragTargetId = this.dragTargetId++

    return [
      dragTargetId,
      (node: VNode<T, U, V>) => ({
        ...node,
        props: {
          ...node.props,
          draggable: 'true',
          onDragstart: (ev: DragEvent) => {
            const id = (this.currentInstanceId + '.' + this.dragEventIndex++)
            this.executions.push(new HtmlExecutionImpl(id, dataOrRef, dragTargetId, ev.target as HTMLElement))
            ev.dataTransfer?.setDragImage(ev.target as Element, 0, 0)
            ev.dataTransfer!.setData('text/plain', '')
            ev.dataTransfer!.setData(prefix + '-' + id, '')
            events.onDragStart?.(ev, unref<IData>(dataOrRef))
          },
          onDragend: (ev: DragEvent) => {
            findAndRemove(this.executions, item => item.movingElement === ev.target)
          }
        }
      }) as any
    ]
  }
  getDroppableDecorator<T, U, V>(
    accept: IData | ((arg: IData) => boolean) | undefined,
    events: {
      onDragOver?: DndDragHandlerWithData<IData>;
      onDragEnter?: DndDragHandlerWithData<IData>;
      onDragLeave?: DndDragHandlerWithData<IData>;
      onDrop?: DndDragHandlerWithData<IData>;
    }
  ): [DragDropTargetIdentifier, (node: VNode<T, U, V>) => VNode<T, U, V>] {
    const dropTargetId = this.dropTargetId++
    const mixinProps = {
      onDrop: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          console.warn('valid id but null data, potentially event from another provider')
          return
        }

        ev.preventDefault()
        findAndRemove(this.executions, item => item.id === id)
        events.onDrop?.(ev, unref<IData>(execution.data))
      },
      onDragenter: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          console.warn('valid id but null data, potentially event from another provider')
          return
        }
        if (execution.targets.indexOf(dropTargetId) < 0) {
          execution.targets.push(dropTargetId)
        }
        events.onDragEnter?.(ev, unref<IData>(execution.data))
      },
      onDragleave: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          console.warn('valid id but null data, potentially event from another provider')
          return
        }

        findAndRemove(execution.targets, i => i === dropTargetId)

        events.onDragLeave?.(ev, unref<IData>(execution.data))
      },
      onDragover: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          console.warn('valid id but null data, potentially event from another provider')
          return
        }

        if (accept != null) {
          if (matchAccept(accept, unref<IData>(execution.data))) {
            ev.preventDefault()
          }
        }

        events.onDragOver?.(ev, unref<IData>(execution.data))
      }
    }
    return [dropTargetId, (node: VNode<T, U, V>) => ({
      ...node,
      props: {
        ...node.props,
        ...mixinProps
      }
    }) as unknown as VNode<T, U, V>]
  }
}

export const useHtmlProvider = () => {
  provide(PROVIDER_INJECTOR_KEY, new HtmlProvider())
}