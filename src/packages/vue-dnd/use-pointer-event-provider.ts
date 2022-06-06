import {
  onMounted,
  onUnmounted,
  provide,
  reactive,
  Ref,
  ref,
  shallowReactive,
  shallowReadonly,
  StyleValue,
  unref,
  VNode
} from "vue";
import {
  DndProvider, DragDropTargetIdentifier, DraggableDecoratorOptions,
  DroppableDecoratorOptions, Execution,
  GetProps
} from "./interfaces";
import { DragType, DropType, matchAccept, PROVIDER_INJECTOR_KEY, UnwrapDragDropType } from "./internal";
import { Default } from "./types";

let instanceId = 0;

export interface PointerEventProviderOptions {
  minDragDistance: number
}

const DEFAULT_OPTIONS: PointerEventProviderOptions = Object.freeze({
  minDragDistance: 5
})

const findAndRemove = <T>(arr: T[], predicate: (arg: T) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const hit = predicate(arr[i]);
    if (hit) {
      arr.splice(i, 1);
    }
  }
};

class PointerExecutionImpl<T extends DragType<unknown>> implements Execution<T> {
  targets: DragDropTargetIdentifier[] = reactive([]);
  public lastEvent: PointerEvent;
  constructor(
    readonly type: T,
    readonly id: string,
    readonly data: UnwrapDragDropType<T> | Ref<UnwrapDragDropType<T>>,
    readonly source: DragDropTargetIdentifier,
    readonly mouseOffset: readonly [number, number],
    public mousePosition: readonly [number, number],
    readonly preview: undefined | (() => VNode<any, any, any>),
    readonly size: readonly [number, number],
    // implementation specified properties
    readonly initialEvent: PointerEvent,
    readonly initialRect: DOMRect,
    readonly initialMouse: readonly [number, number],
    public elementOffset: readonly [number, number]
  ) {
    this.lastEvent = initialEvent;
    return shallowReactive(this);
  }
}

class PointerEventProvider implements DndProvider {
  private currentInstanceId = instanceId++;
  private dragEventIndex = 0;
  private dropTargetId = 0;
  private dragTargetId = 0;
  private stagedExecutions: PointerExecutionImpl<any>[] = []
  private executions: PointerExecutionImpl<any>[] = shallowReactive<
    PointerExecutionImpl<any>[]
  >([]);

  readonly readonlyExecutions = shallowReadonly(this.executions);

  private draggableElements = new Map<DragDropTargetIdentifier, Element>();
  private droppableElements = new Map<DragDropTargetIdentifier, Element>();
  private droppableDeclarations = new Map<
    DragDropTargetIdentifier,
    DroppableDecoratorOptions<DropType<any>>
  >();

  private options: PointerEventProviderOptions

  constructor(opts?: Partial<PointerEventProviderOptions>) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, opts ?? {})
  }

  useDraggableDecorator<ItemType extends DragType<unknown>, T, U, V>(
    {
      data,
      type = Default as any,
      onDragStart,
      preview,
      startDirection = 'all'
    } = {} as DraggableDecoratorOptions<ItemType>
  ): [DragDropTargetIdentifier, GetProps, GetProps] {
    const dragTargetId = this.dragTargetId++;

    const elementRef: Ref<Element | null> = ref(null);
    const handleRef: Ref<Element | null> = ref(null);

    onMounted(() => {
      if (!elementRef.value) {
        console.error('[Vue dnd] Cannot get element with ref, did you applied the props to the element?')
        return;
      }

      if (!handleRef.value) {
        console.error('[Vue dnd] Cannot get handle element with ref, did you applied the props to the element?')
        return;
      }

      this.draggableElements.set(dragTargetId, elementRef.value);
    });

    onUnmounted(() => {
      this.draggableElements.delete(dragTargetId);
    });


    const targetAreas = new Map<DragDropTargetIdentifier, DOMRect>();
    const handleMixin = {
      onPointerdown: (ev: PointerEvent) => {
        const pos = [ev.clientX, ev.clientY] as [number, number];
        const id = this.currentInstanceId + "." + this.dragEventIndex++;
        const rect = elementRef.value!.getBoundingClientRect();
        const mouseOffset = [pos[0] - rect.left, pos[1] - rect.top] as const;
        // rect + offset = mouse
        const offset = [0, 0] as [number, number];

        // clear staled execution if any
        findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
        findAndRemove(this.executions, i => i.initialEvent.pointerId === ev.pointerId)
        this.stagedExecutions.push(
          new PointerExecutionImpl(
            type,
            id,
            data,
            dragTargetId,
            mouseOffset,
            pos,
            preview,
            [rect.width, rect.height],
            ev,
            rect,
            pos,
            offset
          )
        );
        // (ev.target as Element).setPointerCapture(ev.pointerId);
        // events.onDragStart?.(ev, unref<IData>(dataOrRef));
      },
      onContextmenu: (ev: Event) => {
        const stagedExe = this.stagedExecutions.find((exe) => exe.source === dragTargetId);
        if (stagedExe) {
          this.stagedExecutions.splice(this.stagedExecutions.indexOf(stagedExe), 1)
          return
        }

        const exe = this.executions.find((exe) => exe.source === dragTargetId);
        if (exe) {
          ev.preventDefault();
        }
      },
      onPointerout: (ev: PointerEvent) => {
        const stagedExe = this.stagedExecutions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (stagedExe) {
          findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
          return
        }
      },
      onPointermove: (ev: PointerEvent) => {
        const stagedExe = this.stagedExecutions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (stagedExe) {
          const currentPos = [ev.clientX, ev.clientY]
          const initialPos = stagedExe.initialMouse

          const dist = ((currentPos[0] - initialPos[0]) ** 2 + (currentPos[1] - initialPos[1]) ** 2) ** 0.5

          const direction = Math.abs(currentPos[0] - initialPos[0]) > Math.abs(currentPos[1] - initialPos[1]) ? 'x' : 'y'

          if (dist > this.options.minDragDistance! && (unref(startDirection) === 'all' || unref(startDirection) === direction)) {
            findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
            this.executions.push(stagedExe);
            handleRef.value!.setPointerCapture(ev.pointerId);
            // these didn't work due to how type works
            onDragStart?.(ev as any, unref(data) as any);
            getSelection()?.empty()
          }

          return
        }

        const exe = this.executions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (exe) {
          exe.lastEvent = ev;

          const rect = (ev.target as Element).getBoundingClientRect();
          const correctedLastRect = [
            rect.left - exe.elementOffset[0],
            rect.top - exe.elementOffset[1],
          ];

          const rectOffset = [
            correctedLastRect[0] - exe.initialRect.left,
            correctedLastRect[1] - exe.initialRect.top,
          ] as [number, number];

          const fullOffset = [
            -rectOffset[0] + ev.clientX - exe.initialEvent.clientX,
            -rectOffset[1] + ev.clientY - exe.initialEvent.clientY,
          ] as [number, number];

          exe.elementOffset = fullOffset;
          exe.mousePosition = [ev.clientX, ev.clientY];

          // if (targetAreas.size === 0) {
          for (let [id, element] of this.droppableElements) {
            targetAreas.set(id, element.getBoundingClientRect());
          }
          // }

          const oldTargets = exe.targets;
          const newTargets = reactive(
            [...targetAreas]
              .filter(
                ([_, box]) =>
                  box.left < ev.clientX &&
                  box.right > ev.clientX &&
                  box.top < ev.clientY &&
                  box.bottom > ev.clientY
              )
              .map((i) => i[0])
          );

          const oldSet = new Set(oldTargets);
          const newSet = new Set(newTargets);

          const leaved = oldTargets.filter((i) => !newSet.has(i));
          const unchanged = oldTargets.filter((i) => newSet.has(i));
          const entered = newTargets.filter((i) => !oldSet.has(i));

          exe.targets = [...unchanged, ...entered];

          for (let id of leaved) {
            const decl = this.droppableDeclarations.get(id);

            if (decl) {
              // these didn't work due to how type works
              decl.onDragLeave?.(ev as any, unref(exe.data) as any);
            }
          }

          for (let id of entered) {
            const decl = this.droppableDeclarations.get(id);

            if (decl) {
              // these didn't work due to how type works
              decl.onDragEnter?.(ev as any, unref(exe.data) as any);
            }
          }
        }
      },
      onPointercancel: (ev: PointerEvent) => {
        const stagedExe = this.stagedExecutions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (stagedExe) {
          findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
          return
        }

        const exe = this.executions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );
        if (exe) {
          handleRef.value!.releasePointerCapture(ev.pointerId);
          findAndRemove(
            this.executions,
            (exe) => exe.initialEvent.pointerId === ev.pointerId
          );
        }
      },
      onPointerup: (ev: PointerEvent) => {
        const stagedExe = this.stagedExecutions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (stagedExe) {
          findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
          return
        }

        const exe = this.executions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (exe) {
          handleRef.value!.releasePointerCapture(ev.pointerId);

          findAndRemove(
            this.executions,
            (exe) => exe.initialEvent.pointerId === ev.pointerId
          );

          if (targetAreas.size === 0) {
            for (let [id, element] of this.droppableElements) {
              targetAreas.set(id, element.getBoundingClientRect());
            }
          }

          const targets = exe.targets;
          const validTargets = targets.filter((id) => {
            const decl = this.droppableDeclarations.get(id);
            if (decl === undefined) return false;

            return matchAccept(decl.accept, undefined, exe)
          });

          if (validTargets.length > 0) {
            // fire on the last one
            const targetId = validTargets[targets.length - 1];
            const decl = this.droppableDeclarations.get(targetId);

            // these didn't work due to how type works
            decl?.onDrop?.(ev as any, unref(data) as any);
          }
        }
        // this.executions.push(new PointerExecutionImpl(id, data, dragTargetId, ev))
        // events.onDragStart?.(ev, data)
      },
      ref: handleRef,
    };
    const propMixin = {
      ref: elementRef,
    };

    return [
      dragTargetId,
      () => {
        const execution = this.executions.find(
          (i) => i.source === dragTargetId
        );
        const dragging = execution != null;

        // rect + offset = mouse
        const styleOverride: Record<string, string> = dragging && preview === undefined
          ? {
            transform: `translate(${execution.elementOffset[0]}px, ${execution.elementOffset[1]}px)`,
          }
          : {};

        return {
          ...propMixin,
          style: styleOverride,
        };
      },
      () => {
        const execution = this.executions.find(
          (i) => i.source === dragTargetId
        );
        const dragging = execution != null;
        let accepted = false;

        if (execution != null && execution.targets.length > 0) {
          for (let target of execution.targets) {
            const def = this.droppableDeclarations.get(target);

            if (def && matchAccept(def.accept, undefined, execution)) {
              accepted = true
            }
          }
        }

        const styleOverride: StyleValue = dragging
          ? {
            'touch-action': unref(startDirection) === 'all' ? 'none' : unref(startDirection) === 'x' ? 'pan-y' : 'pan-x',
            'user-select': 'none',
            cursor: accepted ? 'move' : 'no-drop',
          }
          : {
            'touch-action': unref(startDirection) === 'all' ? 'none' : unref(startDirection) === 'x' ? 'pan-y' : 'pan-x',
          }
        const finalMixin = {
          ...handleMixin,
          style: styleOverride,
        };
        return finalMixin;
      },
    ];
  }
  useDroppableDecorator<ItemType extends DropType<unknown>, T, U, V>(
    options: DroppableDecoratorOptions<ItemType>
  ): [DragDropTargetIdentifier, GetProps] {
    const dropTargetId = this.dropTargetId++;

    const elementRef: Ref<Element | null> = ref(null);

    onMounted(() => {
      if (!elementRef.value) return;
      this.droppableElements.set(dropTargetId, elementRef.value);
      this.droppableDeclarations.set(dropTargetId, options as unknown as DroppableDecoratorOptions<DropType<any>>);
    });

    onUnmounted(() => {
      this.droppableElements.delete(dropTargetId);
      this.droppableDeclarations.delete(dropTargetId);
    });

    return [
      dropTargetId,
      () => ({
        ref: elementRef,
      }),
    ];
  }
}

export const usePointerEventProvider = (opts?: Partial<PointerEventProviderOptions>) => {
  provide(PROVIDER_INJECTOR_KEY, new PointerEventProvider(opts));
};
