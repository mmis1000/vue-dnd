import { InjectionKey, reactive, shallowReactive } from "vue";
import { DndProvider, DragTargetIdentifier, Execution } from "./interfaces";

export const PROVIDER_INJECTOR_KEY = (import.meta.env.DEV ? 'VUE_DND_KEY' : Symbol('VUE_DND_KEY')) as InjectionKey<DndProvider<any>>
export const nuzz = () => {}

/**
 * This class represent a live dragging action,
 * It records tuple of 'what is being dragged?','what is it dragging over?'
 * The targets are auto indexed with incremental number
 * While the data is decided by user, so we don't really know what it is for now
 */
export class ExecutionImpl<T> implements Execution<T> {
  readonly targets: DragTargetIdentifier[] = reactive([])
  constructor (
    readonly id: string,
    readonly data: T,
    readonly movingElement: HTMLElement
  ) {
    return shallowReactive(this)
  }
}