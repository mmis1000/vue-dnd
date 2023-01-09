import { Ref, UnwrapRef, VNode } from "vue"
import { DragType, DropType, UnwrapArray, UnwrapDragDropType } from "./internal"
import { Type } from "./types"


type Unwrap<T> = T extends Type<string, infer U> ? U : never
export type DndDragHandlerWithData<T extends DropType<any>> =
  Unwrap<UnwrapArray<UnwrapRef<T>>> extends infer U
    ? [U] extends [never]
      ? (ev: DragEvent, data: undefined) => void
      : (ev: DragEvent | PointerEvent, data: U) => void
    : never
  

export type DragDropTargetIdentifier = number

export interface Execution<ItemType extends DragType<any>> {
  readonly type: ItemType,
  readonly id: string,
  readonly data: UnwrapDragDropType<ItemType> | Ref<UnwrapDragDropType<ItemType>>,
  readonly source: DragDropTargetIdentifier,
  readonly targets: readonly DragDropTargetIdentifier[],
  mousePosition: readonly [number, number],
  readonly mouseOffset: readonly [number, number],
  readonly preview?: () => VNode<any, any, any>,
  readonly size?: readonly [number, number],
  readonly initialDragEvent?: DragEvent
}

export type GetProps = () => Record<string, any>

export type StartDirection = 'all' | 'x' | 'y'

export interface DraggableDecoratorOptions<ItemType extends DragType<any>> {
  data: UnwrapDragDropType<ItemType> | Ref<UnwrapDragDropType<ItemType>>
  type: ItemType
  preview?: () => VNode<any, any, any>
  onDragStart?: DndDragHandlerWithData<ItemType>
  startDirection?: StartDirection | Ref<StartDirection>
  disabled?: boolean | Ref<boolean>
}

export interface DroppableDecoratorOptions<ItemType extends DropType<any>> {
  accept: ItemType;
  onDragOver?: DndDragHandlerWithData<ItemType>;
  onDragEnter?: DndDragHandlerWithData<ItemType>;
  onDragLeave?: DndDragHandlerWithData<ItemType>;
  onDrop?: DndDragHandlerWithData<ItemType>;
  disabled?: boolean | Ref<boolean>
}

export interface DndProvider {
  readonly readonlyExecutions: Readonly<Execution<DragType<any>>[]>

  useDraggableDecorator<ItemType extends DragType<any>, RendererNode, RendererElement, ExtraProps>(
    options: DraggableDecoratorOptions<ItemType>
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps,
      getHandleProps: GetProps
    ]

  useDroppableDecorator<ItemType extends DropType<any>, RendererNode, RendererElement, ExtraProps>(
    options: DroppableDecoratorOptions<ItemType>
  ): [
      id: DragDropTargetIdentifier,
      getItemProps: GetProps
    ]
}
