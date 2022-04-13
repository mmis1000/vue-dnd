import { InjectionKey, reactive, shallowReactive } from "vue";
import { DndProvider, DragDropTargetIdentifier, Execution } from "./interfaces";

export const PROVIDER_INJECTOR_KEY = (import.meta.env.DEV ? 'VUE_DND_KEY' : Symbol('VUE_DND_KEY')) as InjectionKey<DndProvider<any>>
export const nuzz = () => {}

export const matchAccept = <T>(accept: T | ((arg: T) => boolean), data: T) => {
  if (typeof accept === 'function') {
    if ((accept as ((arg: T) => boolean))(data)) {
      return true
    }
  } else {
    if (accept === data) {
      return true
    }
  }
  return false
}
