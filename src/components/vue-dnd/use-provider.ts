import { DeepReadonly, provide, reactive, readonly, RendererElement, RendererNode, shallowReactive, shallowReadonly, VNode } from "vue";
import { DndProvider, DragHandlerWithData, DragTargetIdentifier, Execution } from "./interfaces";
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
  // private dataMap = new Map<string, any>()
  private executions: ExecutionImpl<IData>[] = shallowReactive<ExecutionImpl<IData>[]>([])

  readonly readonlyExecutions = shallowReadonly(this.executions)

  decorateDraggable<T, U, V>(
    node: VNode<T, U, V>,
    events: { onDragStart?: DragHandlerWithData<IData>; },
    data: any
  ): VNode<T, U, V> {
    return {
      ...node,
      props: {
        ...node.props,
        draggable: 'true',
        onDragstart: (ev: DragEvent) => {
          const id = (this.currentInstanceId + '.' + this.dragEventIndex++)
          this.executions.push(new ExecutionImpl(id, data, ev.target as HTMLElement))
          ev.dataTransfer!.setData('text/plain', id)
          ev.dataTransfer!.setData(prefix + '-' + id, '')
          events.onDragStart?.(ev, data)
        },
        onDragend: (ev: DragEvent) => {
          findAndRemove(this.executions, item => item.movingElement === ev.target)
        }
      }
    } as any
  }
  getDroppableDecorator<T, U, V>(
    events: {
      onDragOver?: DragHandlerWithData<IData>;
      onDragEnter?: DragHandlerWithData<IData>;
      onDragLeave?: DragHandlerWithData<IData>;
      onDrop?: DragHandlerWithData<IData>;
    }
  ): [DragTargetIdentifier, (node: VNode<T, U, V>) => VNode<T, U, V>] {
    const dropTargetId = this.dropTargetId++
    const mixinProps = {

      onDrop: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          ev.preventDefault()
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          console.warn('valid id but null data, potentially event from another provider')
          ev.preventDefault()
          return
        }

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