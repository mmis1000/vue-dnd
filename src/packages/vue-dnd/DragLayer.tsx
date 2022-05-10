import { cloneVNode, defineComponent, inject, StyleValue } from 'vue'
import { PROVIDER_INJECTOR_KEY } from './internal'

export const DragLayer = defineComponent({
  setup(props, { slots }) {
    const provider = inject(PROVIDER_INJECTOR_KEY)

    if (provider == null) {
      throw new Error('[vue-dnd] DragLayer must be used with a provider')
    }

    const style: StyleValue = {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      overflow: 'hidden',
      'pointer-events': 'none',
    }

    return () => {
      const items = provider.readonlyExecutions
        .filter((i) => i.preview !== undefined && i.size !== undefined)
        .map((i) => {
          const posX = i.mousePosition[0] - i.mouseOffset[0]
          const posY = i.mousePosition[1] - i.mouseOffset[1]
          const sourceSize = i.size!
          const wrapStyle: StyleValue = {
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: sourceSize[0] + 'px',
            height: sourceSize[1] + 'px',
            transform: `translate(${posX}px,${posY}px)`,
            'touch-action': 'none',
            'will-change': 'transform',
          }
          const style: StyleValue = {
            position: 'absolute',
            left: '0px',
            top: '0px',
            bottom: '0px',
            right: '0px',
          }
          return (
            <div style={wrapStyle} key={i.id}>{cloneVNode(i.preview!(), { style })}</div>
          )
        })

      return <div style={style}>{items}</div>
    }
  },
})
