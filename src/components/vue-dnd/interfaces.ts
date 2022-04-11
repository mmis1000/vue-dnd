import { VNode } from "vue"

export interface DND_PROVIDER {
  argumentDraggable<T, U, V> (
    node: VNode<T, U, V>,
    events: {
      onDragStart?: (ev: DragEvent) => void
    },
    data: any
  ): VNode<T, U, V>
  argumentDroppable<T, U, V> (
    node: VNode<T, U, V>,
    events: {
      onDragOver?: ((ev: DragEvent, data: any) => void) | undefined;
      onDragEnter?: ((ev: DragEvent) => void) | undefined;
      onDragLeave?: ((ev: DragEvent) => void) | undefined;
      onDrop?: ((ev: DragEvent, data: any) => void) | undefined;
    }
  ): VNode<T, U, V>
}