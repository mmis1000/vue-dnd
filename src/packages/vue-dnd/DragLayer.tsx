import { defineComponent, inject, StyleValue } from "vue"
import { PROVIDER_INJECTOR_KEY } from "./internal"

export const DragLayer = defineComponent({
  setup (props, { slots }) {
    const provider = inject(PROVIDER_INJECTOR_KEY)

    if (provider == null) {
      throw new Error("[vue-dnd] DragLayer must be used with a provider")
    }

    const style: StyleValue = {
      position: "fixed",
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      overflow: 'hidden'
    }

    return () => {
      return (
        <div style={style}>
        </div>
      )
    }
  }
})
