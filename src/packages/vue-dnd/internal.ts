import { InjectionKey, reactive, shallowReactive } from "vue";
import { DndProvider, DragDropTargetIdentifier, Execution } from "./interfaces";

export const PROVIDER_INJECTOR_KEY = (import.meta.env.DEV ? 'VUE_DND_KEY' : Symbol('VUE_DND_KEY')) as InjectionKey<DndProvider<any>>
export const nuzz = () => {}

export const matchAccept = (accept: any, data: any) => {
  if (typeof accept === 'function') {
    if (accept(data)) {
      return true
    }
  } else {
    if (accept === data) {
      return true
    }
  }
  return false
}
