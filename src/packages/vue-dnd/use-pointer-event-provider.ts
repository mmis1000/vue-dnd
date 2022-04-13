import { NormalizedStyle } from "@vue/shared";
import { ComputedRef, h, normalizeStyle, onMounted, onUnmounted, provide, reactive, Ref, ref, shallowReactive, shallowReadonly, unref, UnwrapRef, VNode } from "vue";
import { DndProvider, DndDragHandlerWithData, DragDropTargetIdentifier, Execution } from "./interfaces";
import { matchAccept, PROVIDER_INJECTOR_KEY } from "./internal";

let instanceId = 0

const findAndRemove = <T>(arr: T[], predicate: (arg: T) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const hit = predicate(arr[i])
    if (hit) {
      arr.splice(i, 1)
    }
  }
}
class PointerExecutionImpl<T> implements Execution<T> {
  targets: DragDropTargetIdentifier[] = reactive([])
  constructor(
    readonly id: string,
    readonly data: T | Ref<T> | ComputedRef<T>,
    readonly source: DragDropTargetIdentifier,
    readonly initialEvent: PointerEvent,
    public lastEvent: PointerEvent,
    readonly initialRect: DOMRect,
    public offset: [number, number]
  ) {
    return shallowReactive(this)
  }
}

class PointerEventProvider<IData> implements DndProvider<IData> {
  private currentInstanceId = instanceId++
  private dragEventIndex = 0
  private dropTargetId = 0
  private dragTargetId = 0
  // private dataMap = new Map<string, any>()
  private executions: PointerExecutionImpl<IData>[] = shallowReactive<PointerExecutionImpl<IData>[]>([])

  readonly readonlyExecutions = shallowReadonly(this.executions)

  private draggableElements = new Map<DragDropTargetIdentifier, Element>()
  private droppableElements = new Map<DragDropTargetIdentifier, Element>()
  private droppableDeclarations = new Map<DragDropTargetIdentifier, {
    accept: IData | ((arg: IData) => boolean),
    events: {
      onDragOver?: DndDragHandlerWithData<IData>;
      onDragEnter?: DndDragHandlerWithData<IData>;
      onDragLeave?: DndDragHandlerWithData<IData>;
      onDrop?: DndDragHandlerWithData<IData>;
    }
  }>()

  getDraggableDecorator<T, U, V>(
    events: { onDragStart?: DndDragHandlerWithData<IData>; },
    dataOrRef: IData | Ref<IData>
  ): [DragDropTargetIdentifier, (node: VNode<T, U, V>) => VNode<T, U, V>] {
    const dragTargetId = this.dragTargetId++

    const elementRef = ref<Element | null>(null)

    onMounted(() => {
      if (!elementRef.value) return
      this.draggableElements.set(dragTargetId, elementRef.value)
    })

    onUnmounted(() => {
      this.draggableElements.delete(dragTargetId)
    })

    const targetAreas = new Map<DragDropTargetIdentifier, DOMRect>()

    const propMixin = {
      ref: elementRef,
      onPointerdown: (ev: PointerEvent) => {
        const id = (this.currentInstanceId + '.' + this.dragEventIndex++)
        const rect = (ev.target as Element).getBoundingClientRect()
        // rect + offset = mouse
        const offset = [0, 0] as [number, number]
        this.executions.push(new PointerExecutionImpl(id, dataOrRef, dragTargetId, ev, ev, rect, offset));
        (ev.target as Element).setPointerCapture(ev.pointerId)
        events.onDragStart?.(ev, unref(dataOrRef))
      },
      onContextmenu: (ev: Event) => {
        const exe = this.executions.find(exe => exe.source === dragTargetId) 
        if (exe) {
          ev.preventDefault()
        }
      },
      onPointermove: (ev: PointerEvent) => {
        const exe = this.executions.find(exe => exe.initialEvent.pointerId === ev.pointerId)
        if (exe) {
          exe.lastEvent = ev
          
          const rect = (ev.target as Element).getBoundingClientRect()
          const correctedLastRect = [rect.left - exe.offset[0], rect.top - exe.offset[1]]

          const rectOffset = [
            correctedLastRect[0] - exe.initialRect.left,
            correctedLastRect[1] - exe.initialRect.top
          ] as [number, number]
          

          const fullOffset = [
            -rectOffset[0] + ev.clientX - exe.initialEvent.clientX,
            -rectOffset[1] + ev.clientY - exe.initialEvent.clientY,
          ] as [number, number]

          exe.offset = fullOffset

          // if (targetAreas.size === 0) {
          for (let [id, element] of this.droppableElements) {
            targetAreas.set(id, element.getBoundingClientRect())
          }
          // }

          const oldTargets = exe.targets
          const newTargets = reactive(
            [...targetAreas]
            .filter(
              ([_, box]) => 
              box.left < ev.clientX
              && box.right > ev.clientX
              && box.top < ev.clientY
              && box.bottom > ev.clientY
            )
            .map(i => i[0])
          )


          const oldSet = new Set(oldTargets)
          const newSet = new Set(newTargets)

          const leaved = oldTargets.filter(i => !newSet.has(i))
          const unchanged = oldTargets.filter(i => newSet.has(i))
          const entered = newTargets.filter(i => !oldSet.has(i))

          exe.targets = [...unchanged, ...entered]

          for (let id of leaved) {
            const decl = this.droppableDeclarations.get(id)

            if (decl) {
              decl.events.onDragLeave?.(ev, unref(exe.data as IData | Ref<IData>))
            }
          }

          for (let id of entered) {
            const decl = this.droppableDeclarations.get(id)

            if (decl) {
              decl.events.onDragEnter?.(ev, unref(exe.data as IData | Ref<IData>))
            }
          }
        }
      },
      onPointercancel: (ev: PointerEvent) => {
        const exe = this.executions.find(exe => exe.initialEvent.pointerId === ev.pointerId)
        if (exe) {
          (ev.target as Element).releasePointerCapture(ev.pointerId)
          findAndRemove(this.executions, exe => exe.initialEvent.pointerId === ev.pointerId)
        }
      },
      onPointerup: (ev: PointerEvent) => {
        const exe = this.executions.find(exe => exe.initialEvent.pointerId === ev.pointerId)
        if (exe) {
          (ev.target as Element).releasePointerCapture(ev.pointerId)
          findAndRemove(this.executions, exe => exe.initialEvent.pointerId === ev.pointerId)

          if (targetAreas.size === 0) {
            for (let [id, element] of this.droppableElements) {
              targetAreas.set(id, element.getBoundingClientRect())
            }
          }

          const targets = exe.targets
          const validTargets = targets.filter(id => {
            const decl = this.droppableDeclarations.get(id)
            if (decl === undefined) return false
            return matchAccept(decl.accept, unref(dataOrRef))
          })

          if (validTargets.length > 0) {
            // fire on the last one
            const targetId = validTargets[targets.length - 1]
            const decl = this.droppableDeclarations.get(targetId)
            decl?.events.onDrop?.(ev, unref(dataOrRef))
          }
        }
        // this.executions.push(new PointerExecutionImpl(id, data, dragTargetId, ev))
        // events.onDragStart?.(ev, data)
      },
      onDragend: () => {
        // findAndRemove(this.executions, item => item.movingElement === ev.target)
      }
    }

    return [
      dragTargetId,
      (node: VNode<T, U, V>) => {
        const originalStyle: NormalizedStyle | string = normalizeStyle((node.props as any).style ?? {}) ?? {}
        const execution = this.executions.find(i => i.source === dragTargetId)
        const dragging = execution != null

        const serializeStyle = (style: Record<string, string>) => {
          return Object.entries(style).map(i => i[0] + ': ' + i[1]).join('; ')
        }

        // rect + offset = mouse
        const styleOverride: Record<string, string> = dragging ? {
          'touch-action': 'none',
          transform: `translate(${
            execution.offset[0]
          }px, ${
            execution.offset[1]
          }px)`
        } : {
          'touch-action': 'none'
        }

        const style = typeof originalStyle === 'string'
          ? originalStyle + '; ' + serializeStyle(styleOverride)
          : { ...originalStyle, ...styleOverride }

        return h(
          node.type as any,
          {
            ...node.props,
            ...propMixin,
            style
          },
          node.children as any
        ) as any
      }
    ]
  }
  getDroppableDecorator<T, U, V>(
    accept: IData | ((arg: IData) => boolean),
    events: {
      onDragOver?: DndDragHandlerWithData<IData>;
      onDragEnter?: DndDragHandlerWithData<IData>;
      onDragLeave?: DndDragHandlerWithData<IData>;
      onDrop?: DndDragHandlerWithData<IData>;
    }
  ): [DragDropTargetIdentifier, (node: VNode<T, U, V>) => VNode<T, U, V>] {
    const dropTargetId = this.dropTargetId++

    const elementRef = ref<Element | null>(null)

    onMounted(() => {
      if (!elementRef.value) return
      this.droppableElements.set(dropTargetId, elementRef.value)
      this.droppableDeclarations.set(dropTargetId, {accept, events})
    })

    onUnmounted(() => {
      this.droppableElements.delete(dropTargetId)
      this.droppableDeclarations.delete(dropTargetId)
    })

    return [dropTargetId, (node: VNode<T, U, V>) => (h(node.type as any, {
      ...node.props,
      ref: elementRef
    } as any, node.children as any)) as unknown as VNode<T, U, V>]
  }
}

export const usePointerEventProvider = () => {
  provide(PROVIDER_INJECTOR_KEY, new PointerEventProvider())
}