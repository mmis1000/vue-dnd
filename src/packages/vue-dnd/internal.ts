import { computed, InjectionKey, isRef, mergeProps, ref, Ref, unref, VNodeProps } from "vue";
import { DndProvider, Execution } from "./interfaces";
import { DragType, DropType, isNativeFileRule, isTypedDataRule, matchNativeFile, matchTyped, TYPE_TYPED } from "./types";

export const PROVIDER_INJECTOR_KEY = (import.meta.env.DEV ? 'VUE_DND_KEY' : Symbol('VUE_DND_KEY')) as InjectionKey<DndProvider>
export const nuzz = () => { }
type Data = { [x: string]: unknown }

export const matchAccept = <T extends DropType<unknown>>(rule: T, ev: DragEvent | undefined, execution: Execution<DragType<any>> | undefined) => {
  const typeOrListOfType = unref(rule)
  const typeList = Array.isArray(typeOrListOfType) ? typeOrListOfType : [typeOrListOfType]

  const sourceSymbols = new Set<symbol>()

  const sourceTypeOrListOfType = execution ? unref(execution.type) : []
  const sourceTypeList = Array.isArray(sourceTypeOrListOfType) ? sourceTypeOrListOfType : [sourceTypeOrListOfType]

  for (const item of sourceTypeList) {
    sourceSymbols.add(item[TYPE_TYPED])
  }

  for (const type of typeList) {
    if (isNativeFileRule(type)) {
      // must 'not' have a execution associated
      if (ev != null && execution == null) {
        if (matchNativeFile(ev, type)) {
          return true
        }
      }
    }

    if (isTypedDataRule(type)) {
      // not initialized inside this package
      if (execution && execution.data != null && sourceSymbols.has(type[TYPE_TYPED])) {
        if (matchTyped(execution.data, type)) {
          return true
        }
      }
    }
  }
}
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