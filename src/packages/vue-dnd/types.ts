import { Ref, unref, UnwrapRef } from "vue"

/**
 * @private
 */
export const TYPE_NATIVE = Symbol('native_file')
/**
 * @private
 */
export const TYPE_TYPED = Symbol('typed')

export interface NativeFileRule {
    [TYPE_NATIVE]: true
    accept?: (ev: DragEvent) => boolean
    withFilter: (accept: NonNullable<NativeFileRule['accept']>) => NativeFileRule
}

export interface Type<NAME extends string, T> {
    name: NAME
    [TYPE_TYPED]: symbol
    accept?: T | ((data: T) => boolean)
    withFilter: (accept: NonNullable<Type<NAME, T>['accept']>) => Type<NAME, T>
}

export type UnwrapArray<T> = T extends (infer U)[] ? U : T
export type ToDataType<T> =
    // native file don't have a custom data field
    T extends NativeFileRule ? undefined :
    // typed data
    T extends Type<any, infer R> ? R :
    // a exact value matching
    T
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

const createNativeFileRule = (accept?: NonNullable<NativeFileRule['accept']>) => {
    return {
        [TYPE_NATIVE]: true as true,
        accept,
        withFilter(accept: NonNullable<NativeFileRule['accept']>) {
            return createNativeFileRule(accept)
        }
    }
}
export const NativeFile: NativeFileRule = createNativeFileRule()
export const createType = <
    T,
    NAME extends string = 'Unnamed Type'
>(accept?: NonNullable<Type<NAME, T>['accept']>): Type<NAME, T> => {
    const type = Symbol()
    return {
        [TYPE_TYPED]: type,
        withFilter(accept) {
            const res = createType(accept)
            res[TYPE_TYPED] = type
            return res
        },
        accept
    } as Type<NAME, T>
}

export const Default = createType<any, 'Default'>('Default')

export type MaybeRef<T> = T | Ref<T>
export type DragType<T> = MaybeRef<Type<any, T> | (Type<any, T>)[]>
export type DropType<T> = MaybeRef<Type<any, T> | NativeFileRule | (Type<any, T> | NativeFileRule)[]>

export type UnwrapDragDropType<T> = ToDataType<UnwrapArray<UnwrapRef<T>>>
