import { computed, InjectionKey, isRef, mergeProps, ref, Ref, VNodeProps } from "vue";
import { TYPES } from "./constants";
import { DndProvider, DroppableAcceptType } from "./interfaces";

export const PROVIDER_INJECTOR_KEY = (import.meta.env.DEV ? 'VUE_DND_KEY' : Symbol('VUE_DND_KEY')) as InjectionKey<DndProvider<any>>
export const nuzz = () => {}

export const matchAccept = <T>(accept: DroppableAcceptType<T>, data: T) => {
  if (accept === TYPES.NONE) {
    return false
  }
  if (accept === TYPES.ANY) {
    return true
  }
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

type Data = { [x: string]: unknown }
export const myMergeProps = (...args: (Data & VNodeProps)[]): Data => {
  const refs: (Ref<unknown> | ((arg: any) => void))[] = []
  const current = ref<unknown>(null)
  for (let item of args) {
    if (isRef(item.ref) || typeof item.ref === 'function') {
      refs.push(item.ref as any)
    } else if (item.ref != null) {
      console.error('cannot support other typeof ref currently')
    }
  }

  let refProxy: Ref<unknown> | null = null

  if (refs.length > 0) {
    refProxy = computed<unknown>({
      set(v) {
        current.value = v
        refs.forEach(r => typeof r === 'function' ? r(v) : r.value = v)
      },
      get(v) {
        return current.value
      }
    })
  }

  return refProxy === null ? mergeProps(...args) : mergeProps(...args, { ref: refProxy })
}