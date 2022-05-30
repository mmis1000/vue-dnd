import { Ref, UnwrapRef, VNode } from "vue"
import type { TYPES } from "./constants"
import { DragType, DropType, ToDataType, Type, UnwrapArray, UnwrapDragDropType } from "./types"
export type DndDragHandlerWithData<T extends DropType<any>> =
  UnwrapArray<UnwrapRef<T>> extends Type<any, infer U>
  ? (ev: DragEvent | PointerEvent, data: U) => void
  : (ev: DragEvent, data: undefined) => void

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

export type DroppableAcceptType<IData> = IData | ((arg: IData) => boolean) | (typeof TYPES)['NONE'] | (typeof TYPES)['ANY']
export type DroppableAcceptNativeType = ((ev: DragEvent) => boolean) | (typeof TYPES)['NONE'] | (typeof TYPES)['ANY']

export interface DraggableDecoratorOptions<ItemType extends DragType<any>> {
  data: UnwrapDragDropType<ItemType> | Ref<UnwrapDragDropType<ItemType>>
  type: ItemType
  preview?: () => VNode<any, any, any>
  onDragStart?: DndDragHandlerWithData<ItemType>
  startDirection?: StartDirection | Ref<StartDirection>
}

export interface DroppableDecoratorOptions<ItemType extends DropType<any>> {
  accept: ItemType;
  onDragOver?: DndDragHandlerWithData<ItemType>;
  onDragEnter?: DndDragHandlerWithData<ItemType>;
  onDragLeave?: DndDragHandlerWithData<ItemType>;
  onDrop?: DndDragHandlerWithData<ItemType>;
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