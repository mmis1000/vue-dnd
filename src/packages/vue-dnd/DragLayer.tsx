import { cloneVNode, defineComponent, inject, onMounted, onUnmounted, Ref, ref, StyleValue } from 'vue'
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

    const currentBox = ref<DOMRect>()

    const layerRoot = ref<HTMLDivElement>()

    const observers: Ref<IntersectionObserver[]> = ref([])

    function boxToMargin(box: [x1: number, y1: number, x2: number, y2: number], root: [width: number, height: number]) {
      const margin = [
        box[1],
        root[0] - box[2],
        root[1] - box[3],
        box[0]
      ]

      return margin.map(i => `${-i}px`).join(' ')
    }

    function expectsElement(
      box: [x1: number, y1: number, x2: number, y2: number],
      root: [width: number, height: number],
      direction: 'in' | 'out',
      cb: () => void
    ) {
      const margin = boxToMargin(box, root)
      const observer = new IntersectionObserver(entries => {
        let triggered = false
        for (const entry of entries) {
          if (entry.isIntersecting && direction === 'out') {
            triggered = true
            break
          }

          if (!entry.isIntersecting && direction === 'in') {
            triggered = true
            break
          }
        }

        if (triggered) {
          cb()
        }
      }, {
        root: document,
        rootMargin: margin
      })
      return observer
    }

    function setupObserver() {
      for (const observer of observers.value) {
        observer.disconnect()
      }

      const box = currentBox.value = layerRoot.value!.getBoundingClientRect()

      const newObservers: IntersectionObserver[] = []

      let hasLeft = false
      let hasTop = false

      if (
        box.right >= 0 && box.left <= document.documentElement.clientWidth
        && box.top >= 0 && box.top < document.documentElement.clientHeight
      ) {
        hasTop = true
        const inObs = expectsElement(
          [box.left, box.top + 1, box.right, box.top + 1],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'in',
          () => setupObserver()
        )
        const outObs = expectsElement(
          [box.left, box.top - 1, box.right, box.top - 1],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'out',
          () => setupObserver()
        )
        inObs.observe(layerRoot.value!)
        outObs.observe(layerRoot.value!)
        newObservers.push(inObs, outObs)
      }

      if (
        box.bottom > 0 && box.top < document.documentElement.clientHeight
        && box.left >= 0 && box.left < document.documentElement.clientWidth
      ) {
        hasLeft = true
        const inObs = expectsElement(
          [box.left + 1, box.top, box.left + 1, box.bottom],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'in',
          () => setupObserver()
        )
        const outObs = expectsElement(
          [box.left - 1, box.top, box.left - 1, box.bottom],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'out',
          () => setupObserver()
        )
        inObs.observe(layerRoot.value!)
        outObs.observe(layerRoot.value!)
        newObservers.push(inObs, outObs)
      }

      if (
        !hasTop
        && box.right >= 0 && box.left <= document.documentElement.clientWidth
        && box.bottom >= 0 && box.bottom < document.documentElement.clientHeight
      ) {
        const inObs = expectsElement(
          [box.left, box.bottom - 1, box.right, box.bottom - 1],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'in',
          () => setupObserver()
        )
        const outObs = expectsElement(
          [box.left, box.bottom + 1, box.right, box.bottom + 1],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'out',
          () => setupObserver()
        )
        inObs.observe(layerRoot.value!)
        outObs.observe(layerRoot.value!)
        newObservers.push(inObs, outObs)
      }

      if (
        !hasLeft
        && box.bottom > 0 && box.top < document.documentElement.clientHeight
        && box.right >= 0 && box.right < document.documentElement.clientWidth
      ) {
        const inObs = expectsElement(
          [box.right - 1, box.top, box.right - 1, box.bottom],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'in',
          () => setupObserver()
        )
        const outObs = expectsElement(
          [box.right + 1, box.top, box.right + 1, box.bottom],
          [document.documentElement.clientWidth, document.documentElement.clientHeight],
          'out',
          () => setupObserver()
        )
        inObs.observe(layerRoot.value!)
        outObs.observe(layerRoot.value!)
        newObservers.push(inObs, outObs)
      }


      if (newObservers.length === 0) {
        const observer = new IntersectionObserver(entries => {
          for (const e of entries) {
            if (e.isIntersecting) {
              setupObserver()
            }
          }
        }, {
          root: document,
          rootMargin: '0px 0px 0px 0px'
        })

        observer.observe(layerRoot.value!)
        newObservers.push(observer)
      }

      observers.value = newObservers
    }

    onMounted(() => {
      setupObserver()
    })

    onUnmounted(() => {
      for (const observer of observers.value) {
        observer.disconnect()
      }
    })

    return () => {
      const items = provider.readonlyExecutions
        .filter((i) => i.preview !== undefined && i.size !== undefined)
        .map((i) => {
          const posX = i.mousePosition[0] - i.mouseOffset[0]
          const posY = i.mousePosition[1] - i.mouseOffset[1]
          const sourceSize = i.size!
          const offset = currentBox.value ? [-currentBox.value.left, -currentBox.value.top] : [0, 0]
          const wrapStyle: StyleValue = {
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: sourceSize[0] + 'px',
            height: sourceSize[1] + 'px',
            transform: `translate(${posX + offset[0]}px,${posY + offset[1]}px)`,
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

      return <div ref={layerRoot} style={style}>
        {items}
      </div>
    }
  },
})
