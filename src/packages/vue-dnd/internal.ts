import { computed, InjectionKey, isRef, mergeProps, ref, Ref, unref, UnwrapRef, VNodeProps } from "vue";
import { DndProvider, Execution } from "./interfaces";
import { NativeFileRule, Type } from "./types";

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

export const TYPE_NATIVE = Symbol('native_file')
export const TYPE_TYPED = Symbol('typed')

export type UnwrapArray<T> = T extends (infer U)[] ? U : T
export type ToDataType<T> =
  // native file don't have a custom data field
  T extends NativeFileRule ? undefined :
  // typed data
  T extends Type<any, infer R> ? R :
  // a exact value matching
  T

export type MaybeRef<T> = T | Ref<T>
export type DragType<T> = MaybeRef<Type<any, T> | (Type<any, T>)[]>
export type DropType<T> = MaybeRef<Type<any, T> | NativeFileRule | (Type<any, T> | NativeFileRule)[]>

export type UnwrapDragDropType<T> = ToDataType<UnwrapArray<UnwrapRef<T>>>

export const isNativeFileRule = (v: any): v is NativeFileRule => {
  return v != null && v[TYPE_NATIVE] === true
}
export const matchNativeFile = (ev: DragEvent, rule: NativeFileRule) => {
  if (rule.accept == null) return true
  return rule.accept(ev)
}
export const isTypedDataRule = (v: any): v is Type<any, any> => {
  return v != null && typeof v[TYPE_TYPED] === 'symbol'
}
export const matchTyped = <T>(data: T | Ref<T>, rule: Type<any, T>) => {
  if (rule.accept == null) return true
  return typeof rule.accept === 'function' ? (rule as any).accept(unref(data)) : rule.accept === unref(data)
}
