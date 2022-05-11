import {
  ComputedRef,
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
  VNode,
} from "vue";
import {
  DndProvider,
  DndDragHandlerWithData,
  DragDropTargetIdentifier,
  Execution,
  GetProps,
} from "./interfaces";
import { matchAccept, PROVIDER_INJECTOR_KEY } from "./internal";

let instanceId = 0;

export interface PointerEventProviderOptions {
  minDragDistance: number
}

const DEFAULT_OPTIONS: PointerEventProviderOptions = Object.freeze({
  minDragDistance: 10
})

const findAndRemove = <T>(arr: T[], predicate: (arg: T) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const hit = predicate(arr[i]);
    if (hit) {
      arr.splice(i, 1);
    }
  }
};

class PointerExecutionImpl<T> implements Execution<T> {
  targets: DragDropTargetIdentifier[] = reactive([]);
  public lastEvent: PointerEvent;
  constructor(
    readonly id: string,
    readonly data: T | Ref<T> | ComputedRef<T>,
    readonly source: DragDropTargetIdentifier,
    readonly mouseOffset: readonly [number, number],
    public mousePosition: readonly [number, number],
    readonly preview: undefined | (() => VNode<any, any, any>),
    readonly size: readonly [number, number],
    // implementation specified properties
    readonly initialEvent: PointerEvent,
    readonly initialRect: DOMRect,
    readonly initialMouse: [number, number],
    public elementOffset: readonly [number, number]
  ) {
    this.lastEvent = initialEvent;
    return shallowReactive(this);
  }
}

class PointerEventProvider<IData> implements DndProvider<IData> {
  private currentInstanceId = instanceId++;
  private dragEventIndex = 0;
  private dropTargetId = 0;
  private dragTargetId = 0;
  private stagedExecutions: PointerExecutionImpl<IData>[] = []
  private executions: PointerExecutionImpl<IData>[] = shallowReactive<
    PointerExecutionImpl<IData>[]
  >([]);

  readonly readonlyExecutions = shallowReadonly(this.executions);

  private draggableElements = new Map<DragDropTargetIdentifier, Element>();
  private droppableElements = new Map<DragDropTargetIdentifier, Element>();
  private droppableDeclarations = new Map<
    DragDropTargetIdentifier,
    {
      accept: IData | ((arg: IData) => boolean);
      events: {
        onDragOver?: DndDragHandlerWithData<IData>;
        onDragEnter?: DndDragHandlerWithData<IData>;
        onDragLeave?: DndDragHandlerWithData<IData>;
        onDrop?: DndDragHandlerWithData<IData>;
      };
    }
    >();

  private options: PointerEventProviderOptions

  constructor(opts?: Partial<PointerEventProviderOptions>) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, opts ?? {})
  }

  getDraggableDecorator<T, U, V>(
    events: { onDragStart?: DndDragHandlerWithData<IData> },
    dataOrRef: IData | Ref<IData> | ComputedRef<IData>,
    previewGetter?: () => VNode<any, any, any>
  ): [DragDropTargetIdentifier, GetProps, GetProps] {
    const dragTargetId = this.dragTargetId++;

    const elementRef: Ref<Element | null> = ref(null);

    onMounted(() => {
      if (!elementRef.value) return;
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
        const rect = (ev.target as Element).getBoundingClientRect();
        const mouseOffset = [pos[0] - rect.left, pos[1] - rect.top] as const;
        // rect + offset = mouse
        const offset = [0, 0] as [number, number];

        // clear staled execution if any
        findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
        findAndRemove(this.executions, i => i.initialEvent.pointerId === ev.pointerId)
        this.stagedExecutions.push(
          new PointerExecutionImpl(
            id,
            dataOrRef,
            dragTargetId,
            mouseOffset,
            pos,
            previewGetter,
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
      onPointermove: (ev: PointerEvent) => {
        const stagedExe = this.stagedExecutions.find(
          (exe) => exe.initialEvent.pointerId === ev.pointerId
        );

        if (stagedExe) {
          const currentPos = [ev.clientX, ev.clientY]
          const initialPos = stagedExe.initialMouse
          const dist = ((currentPos[0] - initialPos[0]) ** 2 + (currentPos[1] - initialPos[1]) ** 2) ** 0.5
          if (dist > this.options.minDragDistance!) {
            findAndRemove(this.stagedExecutions, i => i.initialEvent.pointerId === ev.pointerId)
            this.executions.push(stagedExe);
            (ev.target as Element).setPointerCapture(ev.pointerId);
            events.onDragStart?.(ev, unref<IData>(dataOrRef));
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
              decl.events.onDragLeave?.(ev, unref<IData>(exe.data));
            }
          }

          for (let id of entered) {
            const decl = this.droppableDeclarations.get(id);

            if (decl) {
              decl.events.onDragEnter?.(ev, unref<IData>(exe.data));
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
          (ev.target as Element).releasePointerCapture(ev.pointerId);
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
          (ev.target as Element).releasePointerCapture(ev.pointerId);
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
            return matchAccept(decl.accept, unref<IData>(dataOrRef));
          });

          if (validTargets.length > 0) {
            // fire on the last one
            const targetId = validTargets[targets.length - 1];
            const decl = this.droppableDeclarations.get(targetId);
            decl?.events.onDrop?.(ev, unref<IData>(dataOrRef));
          }
        }
        // this.executions.push(new PointerExecutionImpl(id, data, dragTargetId, ev))
        // events.onDragStart?.(ev, data)
      },
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
        const styleOverride: Record<string, string> = dragging && previewGetter === undefined
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

            if (def) {
              accepted = matchAccept(def.accept, unref<IData>(execution.data));
            }
          }
        }

        const styleOverride: StyleValue = dragging
          ? {
            "touch-action": "none",
            'user-select': 'none',
            cursor: accepted ? "move" : "no-drop",
          }
          : {
            "touch-action": "none",
          };
        const finalMixin = {
          ...handleMixin,
          style: styleOverride,
        };
        return finalMixin;
      },
    ];
  }
  getDroppableDecorator<T, U, V>(
    accept: IData | ((arg: IData) => boolean),
    events: {
      onDragOver?: DndDragHandlerWithData<IData>;
      onDragEnter?: DndDragHandlerWithData<IData>;
      onDragLeave?: DndDragHandlerWithData<IData>;
      onDrop?: DndDragHandlerWithData<IData>;
    }
  ): [DragDropTargetIdentifier, GetProps] {
    const dropTargetId = this.dropTargetId++;

    const elementRef: Ref<Element | null> = ref(null);

    onMounted(() => {
      if (!elementRef.value) return;
      this.droppableElements.set(dropTargetId, elementRef.value);
      this.droppableDeclarations.set(dropTargetId, { accept, events });
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
