import { provide, shallowReactive, shallowReadonly, VNode } from "vue";
import { DndProvider, DragHandlerWithData, DragDropTargetIdentifier } from "./interfaces";
import { ExecutionImpl, PROVIDER_INJECTOR_KEY } from "./internal";

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
class Provider<IData> implements DndProvider<IData> {
  private currentInstanceId = instanceId++
  private dragEventIndex = 0
  private dropTargetId = 0
  private dragTargetId = 0
  // private dataMap = new Map<string, any>()
  private executions: ExecutionImpl<IData>[] = shallowReactive<ExecutionImpl<IData>[]>([])

  readonly readonlyExecutions = shallowReadonly(this.executions)

  getDraggableDecorator<T, U, V>(
    events: { onDragStart?: DragHandlerWithData<IData>; },
    data: any
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
            this.executions.push(new ExecutionImpl(id, data, dragTargetId, ev.target as HTMLElement))
            ev.dataTransfer?.setDragImage(ev.target as any, 0, 0)
            ev.dataTransfer!.setData('text/plain', '')
            ev.dataTransfer!.setData(prefix + '-' + id, '')
            events.onDragStart?.(ev, data)
          },
          onDragend: (ev: DragEvent) => {
            findAndRemove(this.executions, item => item.movingElement === ev.target)
          }
        }
      }) as any
    ]
  }
  getDroppableDecorator<T, U, V>(
    events: {
      onDragOver?: DragHandlerWithData<IData>;
      onDragEnter?: DragHandlerWithData<IData>;
      onDragLeave?: DragHandlerWithData<IData>;
      onDrop?: DragHandlerWithData<IData>;
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
        events.onDrop?.(ev, execution.data)
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
        events.onDragEnter?.(ev, execution?.data)
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

        events.onDragLeave?.(ev, execution?.data)
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

        events.onDragOver?.(ev, execution?.data)
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

export const useProvider = () => {
  provide(PROVIDER_INJECTOR_KEY, new Provider())
}