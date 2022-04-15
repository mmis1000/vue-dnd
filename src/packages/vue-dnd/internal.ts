import { h, InjectionKey, VNode, normalizeStyle } from "vue";
import { NormalizedStyle } from "vue/node_modules/@vue/shared";
import { DndProvider } from "./interfaces";

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


export const mixinProps = <T, U, V>(node: VNode<T, U, V>, props: any) => {
  const newNode = h(node.type as any, {
    ...node.props,
    ...props
  } as any, node.children as any) as unknown as VNode<T, U, V>
  return newNode
}

const serializeStyle = (style: Record<string, string>) => {
  return Object.entries(style).map(i => i[0] + ': ' + i[1]).join('; ')
}


export const extendStyle = (originalStyle: any, extension: Record<string, string>): string | NormalizedStyle => {
  const normalized = normalizeStyle(originalStyle ?? {}) ?? {}
  const style = typeof normalized === 'string'
  ? normalized + '; ' + serializeStyle(extension)
  : { ...normalized, ...extension }
  return style 
}