import { ComputedRef, Ref } from "vue"

export type DndDragHandlerWithData<IData> = (ev: DragEvent | PointerEvent, data: IData) => void

export type DragDropTargetIdentifier = number

export interface Execution<T> {
  readonly id: string,
  readonly data: T | Ref<T> | ComputedRef<T>,
  readonly source: DragDropTargetIdentifier,
  readonly targets: DragDropTargetIdentifier[],
  readonly mouseOffset: readonly [number, number]
}

export type GetProps = () => Record<string, any>

export interface DndProvider<IData> {
  readonly readonlyExecutions: Readonly<Execution<IData>[]>

  getDraggableDecorator<RendererNode, RendererElement, ExtraProps>(
    events: {
      onDragStart?: DndDragHandlerWithData<IData>
    },
    dataOrRef: IData | Ref<IData> | ComputedRef<IData>
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps,
      getHandleProps: GetProps
    ]

  getDroppableDecorator<RendererNode, RendererElement, ExtraProps>(
    accept: IData | ((arg: IData) => boolean),
    events: {
      onDragOver?: DndDragHandlerWithData<IData>;
      onDragEnter?: DndDragHandlerWithData<IData>;
      onDragLeave?: DndDragHandlerWithData<IData>;
      onDrop?: DndDragHandlerWithData<IData>;
    }
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps
    ]
}