import { TYPE_NATIVE, TYPE_TYPED } from "./internal"

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
