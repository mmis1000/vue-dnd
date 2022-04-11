import { InjectionKey } from "vue";
import { DND_PROVIDER } from "./interfaces";

export const PROVIDER_INJECTOR_KEY = (import.meta.env.DEV ? 'VUE_DND_KEY' : Symbol('VUE_DND_KEY')) as InjectionKey<DND_PROVIDER>
export const nuzz = () => {}