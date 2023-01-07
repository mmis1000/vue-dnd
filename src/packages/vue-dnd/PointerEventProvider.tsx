import { defineComponent } from 'vue'
import { usePointerEventProvider } from './use-pointer-event-provider'
export const PointerEventProvider = defineComponent({
    setup(_props, { slots }) {
        usePointerEventProvider()

        return () => {
            return slots.default?.() ?? []
        }
    }
})