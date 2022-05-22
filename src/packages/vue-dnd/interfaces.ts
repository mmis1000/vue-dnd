import { ComputedRef, Ref, VNode } from "vue"

export type DndDragHandlerWithData<IData> = (ev: DragEvent | PointerEvent, data: IData) => void
export type DndDragHandlerNative = (ev: DragEvent) => void

export type DragDropTargetIdentifier = number

export interface Execution<T> {
  readonly id: string,
  readonly data: T | Ref<T> | ComputedRef<T>,
  readonly source: DragDropTargetIdentifier,
  readonly targets: readonly DragDropTargetIdentifier[],
  mousePosition: readonly [number, number],
  readonly mouseOffset: readonly [number, number],
  readonly preview?: () => VNode<any, any, any>,
  readonly size?: readonly [number, number]
}

export type GetProps = () => Record<string, any>

export type StartDirection = 'all' | 'x' | 'y'

export interface DraggableDecoratorOptions<IData> {
  preview?: () => VNode<any, any, any>
  onDragStart?: DndDragHandlerWithData<IData>
  startDirection?: StartDirection | Ref<StartDirection>
}

export interface DroppableDecoratorOptions<IData> {
  accept: IData | ((arg: IData) => boolean);
  onDragOver?: DndDragHandlerWithData<IData>;
  onDragEnter?: DndDragHandlerWithData<IData>;
  onDragLeave?: DndDragHandlerWithData<IData>;
  onDrop?: DndDragHandlerWithData<IData>;
  acceptNative?: true | ((ev: DragEvent) => boolean);
  onDragOverNative?: DndDragHandlerNative;
  onDragEnterNative?: DndDragHandlerNative;
  onDragLeaveNative?: DndDragHandlerNative;
  onDropNative?: DndDragHandlerNative;
}

export interface DndProvider<IData> {
  readonly readonlyExecutions: Readonly<Execution<IData>[]>

  useDraggableDecorator<RendererNode, RendererElement, ExtraProps>(
    dataOrRef: IData | Ref<IData>,
    options?: DraggableDecoratorOptions<IData>
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps,
      getHandleProps: GetProps
    ]

  useDroppableDecorator<RendererNode, RendererElement, ExtraProps>(
    options: {
      accept: IData | ((arg: IData) => boolean);
      onDragOver?: DndDragHandlerWithData<IData>;
      onDragEnter?: DndDragHandlerWithData<IData>;
      onDragLeave?: DndDragHandlerWithData<IData>;
      onDrop?: DndDragHandlerWithData<IData>;
      acceptNative?: true | ((ev: DragEvent) => boolean);
      onDragOverNative?: DndDragHandlerNative;
      onDragEnterNative?: DndDragHandlerNative;
      onDragLeaveNative?: DndDragHandlerNative;
      onDropNative?: DndDragHandlerNative;
    }
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps
    ]
}