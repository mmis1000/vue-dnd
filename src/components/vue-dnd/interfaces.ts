import { reactive, UnwrapNestedRefs, VNode } from "vue"

export type DragHandlerWithData<IData> = (ev: DragEvent, data: IData) => void

export type DragTargetIdentifier = number

export interface Execution<T> {
  readonly id: string,
  readonly data: T,
  readonly targets:  DragTargetIdentifier[]
}

export interface DndProvider<IData> {
  readonly readonlyExecutions: Readonly<Execution<IData>[]>
  
  decorateDraggable<RendererNode, RendererElement, ExtraProps> (
    node: VNode<RendererNode, RendererElement, ExtraProps>,
    events: {
      onDragStart?: DragHandlerWithData<IData>
    },
    data: IData
  ): VNode<RendererNode, RendererElement, ExtraProps>

  getDroppableDecorator<RendererNode, RendererElement, ExtraProps> (
    events: {
      onDragOver?: DragHandlerWithData<IData>;
      onDragEnter?: DragHandlerWithData<IData>;
      onDragLeave?: DragHandlerWithData<IData>;
      onDrop?: DragHandlerWithData<IData>;
    }
  ): [DragTargetIdentifier, (node: VNode<RendererNode, RendererElement, ExtraProps>) => VNode<RendererNode, RendererElement, ExtraProps>]
}