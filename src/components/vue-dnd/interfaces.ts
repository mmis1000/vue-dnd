import { VNode } from "vue"

export type DragHandlerWithData<IData> = (ev: DragEvent, data: IData) => void

export type DragDropTargetIdentifier = number

export interface Execution<T> {
  readonly id: string,
  readonly data: T,
  readonly source: DragDropTargetIdentifier,
  readonly targets:  DragDropTargetIdentifier[]
}

export interface DndProvider<IData> {
  readonly readonlyExecutions: Readonly<Execution<IData>[]>
  
  getDraggableDecorator<RendererNode, RendererElement, ExtraProps> (
    events: {
      onDragStart?: DragHandlerWithData<IData>
    },
    data: IData
  ): [DragDropTargetIdentifier, (node: VNode<RendererNode, RendererElement, ExtraProps>) => VNode<RendererNode, RendererElement, ExtraProps>]

  getDroppableDecorator<RendererNode, RendererElement, ExtraProps> (
    events: {
      onDragOver?: DragHandlerWithData<IData>;
      onDragEnter?: DragHandlerWithData<IData>;
      onDragLeave?: DragHandlerWithData<IData>;
      onDrop?: DragHandlerWithData<IData>;
    }
  ): [DragDropTargetIdentifier, (node: VNode<RendererNode, RendererElement, ExtraProps>) => VNode<RendererNode, RendererElement, ExtraProps>]
}