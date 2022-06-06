import { computed, onMounted, onUnmounted, provide, reactive, ref, Ref, shallowReactive, shallowReadonly, unref, VNode } from "vue";
import { DndProvider, DragDropTargetIdentifier, DraggableDecoratorOptions, DroppableDecoratorOptions, Execution, GetProps } from "./interfaces";
import { DragType, DropType, matchAccept, nativeDragExecutionId, nativeDragSourceId, PROVIDER_INJECTOR_KEY, UnwrapDragDropType } from "./internal";
import { Default } from "./types";

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

class HtmlExecutionImpl<T extends DragType<any>> implements Execution<T> {
  readonly targetStatus: DropTargetState[] = reactive([])

  readonly mappedTargets = computed(() => {
    return this.targetStatus.map(s => s.id)
  })

  get targets(): readonly DragDropTargetIdentifier[] {
    return this.mappedTargets.value
  }

  constructor(
    readonly type: T,
    readonly id: string,
    readonly data: UnwrapDragDropType<T> | Ref<UnwrapDragDropType<T>>,
    readonly source: DragDropTargetIdentifier,
    readonly mouseOffset: readonly [number, number],
    public mousePosition: readonly [number, number],
    readonly preview: undefined | (() => VNode<any, any, any>),
    readonly size: readonly [number, number],
    readonly initialDragEvent: DragEvent,
    // implementation specified properties
    readonly movingElement?: HTMLElement
  ) {
    return shallowReactive(this)
  }
}

class HtmlProvider implements DndProvider {
  private currentInstanceId = instanceId++
  private dragEventIndex = 0
  private dropTargetId = 0
  private dragTargetId = 0
  private executions: HtmlExecutionImpl<DragType<unknown>>[] = shallowReactive<
    HtmlExecutionImpl<DragType<unknown>>[]
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

  useDraggableDecorator<ItemType extends DragType<unknown>, T, U, V>(
    {
      data,
      type = Default as any,
      onDragStart,
      preview,
      startDirection = 'all'
    } = {} as DraggableDecoratorOptions<ItemType>
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
          type,
          id,
          data,
          dragTargetId,
          mouseOffset,
          pos,
          preview,
          [elPos.width, elPos.height],
          ev,
          ev.target as HTMLElement
        ))
        if (preview == null) {
          ev.dataTransfer?.setDragImage(elementRef.value!, ...mouseOffset)
        } else {
          ev.dataTransfer?.setDragImage(this.emptyImage, 0, 0)
        }
        ev.dataTransfer!.setData('text/plain', '')
        ev.dataTransfer!.setData(prefix + '-' + id, '')
        onDragStart?.(ev, unref(data) as any)
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
  useDroppableDecorator<ItemType extends DropType<unknown>, T, U, V>(
    options: DroppableDecoratorOptions<ItemType>
  ): [DragDropTargetIdentifier, GetProps] {
    const dropTargetId = this.dropTargetId++
    const mixinProps = {
      onDrop: (ev: DragEvent) => {
        const id = getId(ev)
        const execution = this.executions.find(i => i.id === id)

        if (id != null && execution == null) {
          // we don't care. it is event from other provider
          return
        }

        if (matchAccept(options.accept, ev, execution)) {
          ev.preventDefault()
          findAndRemove(this.executions, item => item.id === (id ?? nativeDragExecutionId))
          options.onDrop?.(ev, execution ? unref(execution.data) as any : undefined)
        }
      },
      onDragenter: (ev: DragEvent) => {
        const id = getId(ev)
        const execution = this.executions.find(i => i.id === id)

        if (id == null && execution == null) {
          // probably a native event?
          const matched = matchAccept(options.accept, ev, undefined)
          if (matched) {
            let currentExecution = this.executions.find(i => i.id === nativeDragExecutionId)
            if (currentExecution == null) {
              currentExecution = new HtmlExecutionImpl(
                [],
                nativeDragExecutionId,
                undefined,
                nativeDragSourceId,
                [0, 0],
                [0, 0],
                undefined,
                [0, 0],
                ev,
                undefined
              )
              this.executions.push(currentExecution)
            }
            if (currentExecution.targetStatus.find(i => i.id === dropTargetId) == null) {
              currentExecution.targetStatus.push({ id: dropTargetId, elements: [] })
            }

            currentExecution.targetStatus.find(i => i.id === dropTargetId)!.elements.push(ev.target as Element)

            options.onDragEnter?.(ev, unref(currentExecution.data) as any)
            return
          }
        }

        if (execution == null) {
          // return, not a event from this provider
          return
        }

        if (execution.targetStatus.find(i => i.id === dropTargetId) == null) {
          execution.targetStatus.push({ id: dropTargetId, elements: [] })
        }

        execution.targetStatus.find(i => i.id === dropTargetId)!.elements.push(ev.target as Element)

        options.onDragEnter?.(ev, unref(execution.data) as any)
      },
      onDragleave: (ev: DragEvent) => {
        const id = getId(ev)

        const execution = this.executions.find(i => i.id === id)

        if (id == null && execution == null) {
          // probably a native event?
          const matched = matchAccept(options.accept, ev, undefined)
          if (matched) {
            const currentExecution = this.executions.find(i => i.id === nativeDragExecutionId)
            if (currentExecution != null) {

              const targetStatus = currentExecution.targetStatus.find(i => i.id === dropTargetId)

              if (targetStatus != null) {
                findAndRemove(targetStatus.elements, i => i === ev.target)

                if (targetStatus.elements.length === 0) {
                  findAndRemove(currentExecution.targetStatus, i => i === targetStatus)
                }
              }

              if (currentExecution.targetStatus.length === 0) {
                // also remove execution itself

                findAndRemove(this.executions, i => i.id === nativeDragExecutionId)
              }

              options.onDragLeave?.(ev, unref(currentExecution.data) as any)

              return
            }
            // do not call event because we didn't even call enter
          }
        }

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


        options.onDragLeave?.(ev, unref(execution.data) as any)
      },
      onDragover: (ev: DragEvent) => {
        const id = getId(ev)
        const execution = this.executions.find(i => i.id === id)

        if (id != null && execution == null) {
          // return, not a event from this provider
          return
        }

        if (matchAccept(options.accept, ev, execution)) {
          ev.preventDefault()
          options.onDragOver?.(ev, execution ? unref(execution.data) as any : undefined)
        }
      }
    }
    return [dropTargetId, () => mixinProps]
  }
}

export const useHtmlProvider = () => {
  provide(PROVIDER_INJECTOR_KEY, new HtmlProvider())
}