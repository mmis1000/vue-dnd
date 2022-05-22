import { computed, ComputedRef, onMounted, onUnmounted, provide, reactive, ref, Ref, shallowReactive, shallowReadonly, unref, VNode } from "vue";
import { TYPES } from "./constants";
import { DndProvider, DndDragHandlerWithData, DragDropTargetIdentifier, Execution, GetProps, StartDirection, DndDragHandlerNative, DraggableDecoratorOptions, DroppableDecoratorOptions } from "./interfaces";
import { matchAccept, PROVIDER_INJECTOR_KEY } from "./internal";

let instanceId = 0

const TRANSPARENT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='

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

interface DropTargetState {
  id: DragDropTargetIdentifier
  elements: Element[]
}

class HtmlExecutionImpl<T> implements Execution<T> {
  readonly targetStatus: DropTargetState[] = reactive([])

  readonly mappedTargets = computed(() => {
    return this.targetStatus.map(s => s.id)
  })

  get targets(): readonly DragDropTargetIdentifier[] {
    return this.mappedTargets.value
  }

  constructor(
    readonly id: string,
    readonly data: T | Ref<T> | ComputedRef<T>,
    readonly source: DragDropTargetIdentifier,
    readonly mouseOffset: readonly [number, number],
    public mousePosition: readonly [number, number],
    readonly preview: undefined | (() => VNode<any, any, any>),
    readonly size: readonly [number, number],
    // implementation specified properties
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
  private executions: HtmlExecutionImpl<IData>[] = shallowReactive<
    HtmlExecutionImpl<IData>[]
  >([])
  private emptyImage: HTMLImageElement

  readonly readonlyExecutions = shallowReadonly(this.executions)

  constructor() {
    this.emptyImage = new Image()
    this.emptyImage.src = TRANSPARENT_IMAGE

    const dragOverHandler = (ev: DragEvent) => {
      // console.log(ev)
      if (this.executions.length !== 0) {
        const position = [ev.clientX, ev.clientY] as const
        for (const exe of this.executions) {
          exe.mousePosition = position
        }
      }

      const id = getId(ev)
      const inst = id != null ? this.executions.find(exe => exe.id === id) : undefined
      if (inst && inst.preview != null) {
        // console.log(ev.defaultPrevented)
        if (!ev.defaultPrevented) {
          ev.preventDefault()
          // must be 'move' or the drop handler didn't work
          // https://www.w3.org/html/wg/spec/dnd.html#drag-and-drop-processing-model
          ev.dataTransfer!.dropEffect = 'move'
        } else {
          ev.dataTransfer!.dropEffect = 'copy'
        }
      }
    }

    const dropHandler = (ev: DragEvent) => {
      const id = getId(ev)
      const inst =
        id != null ? this.executions.find((exe) => exe.id === id) : undefined
      if (inst && inst.preview != null) {
        ev.preventDefault()
      }
    }

    onMounted(() => {
      document.addEventListener('dragover', dragOverHandler)
      document.addEventListener('drop', dropHandler)
    })

    onUnmounted(() => {
      document.removeEventListener('dragover', dragOverHandler)
      document.removeEventListener('drop', dropHandler)
    })
  }

  useDraggableDecorator<T, U, V>(
    dataOrRef: IData | Ref<IData>,
    {
      onDragStart,
      preview,
      startDirection = 'all'
    } = <DraggableDecoratorOptions<IData>>{}
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps,
      getHandleProps: GetProps
    ] {
    const dragTargetId = this.dragTargetId++

    const elementRef: Ref<Element | null> = ref(null)

    const itemMixin = {
      ref: elementRef
    }

    const handleMixin = {
      draggable: 'true',
      onDragstart: (ev: DragEvent) => {
        const id = (this.currentInstanceId + '.' + this.dragEventIndex++)
        const pos = [ev.clientX, ev.clientY] as [number, number]
        const elPos = elementRef.value!.getBoundingClientRect()
        const mouseOffset = [pos[0] - elPos.left, pos[1] - elPos.top] as const
        // console.log(elementRef.value, pos, elPos, mouseOffset)
        this.executions.push(new HtmlExecutionImpl(
          id,
          dataOrRef,
          dragTargetId,
          mouseOffset,
          pos,
          preview,
          [elPos.width, elPos.height],
          ev.target as HTMLElement
        ))
        if (preview == null) {
          ev.dataTransfer?.setDragImage(elementRef.value!, ...mouseOffset)
        } else {
          ev.dataTransfer?.setDragImage(this.emptyImage, 0, 0)
        }
        ev.dataTransfer!.setData('text/plain', '')
        ev.dataTransfer!.setData(prefix + '-' + id, '')
        onDragStart?.(ev, unref<IData>(dataOrRef))
      },
      onDragend: (ev: DragEvent) => {
        findAndRemove(this.executions, item => item.movingElement === ev.target)
      }
    }

    return [
      dragTargetId,
      () => itemMixin,
      () => handleMixin
    ]
  }
  useDroppableDecorator<T, U, V>(
    options: DroppableDecoratorOptions<IData>
  ): [DragDropTargetIdentifier, GetProps] {
    const dropTargetId = this.dropTargetId++
    const mixinProps = {
      onDrop: (ev: DragEvent) => {
        const id = getId(ev)

        if (id === null) {
          if (options.acceptNative != null) {
            ev.preventDefault()
          }

          if (options.onDropNative != null) {
            options.onDropNative(ev)
          }
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          // return, not a event from this provider
          return
        }

        ev.preventDefault()
        findAndRemove(this.executions, item => item.id === id)

        options.onDrop?.(ev, unref<IData>(execution.data))
      },
      onDragenter: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          if (options.onDragEnterNative != null) {
            options.onDragEnterNative(ev)
          }

          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          // return, not a event from this provider
          return
        }

        if (execution.targetStatus.find(i => i.id === dropTargetId) == null) {
          execution.targetStatus.push({ id: dropTargetId, elements: [] })
        }

        execution.targetStatus.find(i => i.id === dropTargetId)!.elements.push(ev.target as Element)

        options.onDragEnter?.(ev, unref<IData>(execution.data))
      },
      onDragleave: (ev: DragEvent) => {
        const id = getId(ev)

        if (id === null) {
          if (options.onDragLeaveNative != null) {
            options.onDragLeaveNative(ev)
          }

          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          // return, not a event from this provider
          return
        }

        const targetStatus = execution.targetStatus.find(i => i.id === dropTargetId)

        if (targetStatus != null) {
          findAndRemove(targetStatus.elements, i => i === ev.target)

          if (targetStatus.elements.length === 0) {
            findAndRemove(execution.targetStatus, i => i === targetStatus)
          }
        }


        options.onDragLeave?.(ev, unref<IData>(execution.data))
      },
      onDragover: (ev: DragEvent) => {
        const id = getId(ev)
        if (id === null) {
          if (
            (typeof options.acceptNative === 'function' && options.acceptNative(ev)) ||
            options.acceptNative === true
          ) {
            ev.preventDefault()
          }

          if (options.onDragOverNative != null) {
            options.onDragOverNative(ev)
          }
          return
        }

        const execution = this.executions.find(i => i.id === id)

        if (execution == null) {
          // return, not a event from this provider
          return
        }

        if (matchAccept(options.accept ?? TYPES.NONE, unref<IData>(execution.data))) {
          ev.preventDefault()
        }

        options.onDragOver?.(ev, unref<IData>(execution.data))
      }
    }
    return [dropTargetId, () => mixinProps]
  }
}

export const useHtmlProvider = () => {
  provide(PROVIDER_INJECTOR_KEY, new HtmlProvider())
}