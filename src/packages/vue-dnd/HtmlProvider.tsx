import { defineComponent } from 'vue'
import { useHtmlProvider } from './use-html-provider'
export const HtmlProvider = defineComponent({
    setup(_props, { slots }) {
        useHtmlProvider()

        return () => {
            return slots.default?.() ?? []
        }
    }
})