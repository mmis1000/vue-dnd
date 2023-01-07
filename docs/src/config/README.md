---
sidebar: auto
---

# Config

## Hooks

### useHtmlProvider

hook that provides native dnd based dnd experience

- props
  - works with native file upload
- cons
  - does not work on touch devices

### usePointerEventProvider

hook that provides pointer event-based dnd experience

- props
  - works on touch devices
- cons
  - does not work with native file upload

### useDraggable

```ts
function useDraggable (
  type,
  data,
  options?
): {
  propsItem: ComputedRef<Record<string, any>>
  state: {
    isDragging: ComputedRef<boolean>
  }
}
```

- Arguments
  - type
    - Type: `Type<T>`
  - data
    - Type: `T`
  - options
    - Type: object
    - properties
      - ref
        - Description: ref container to contain target dom element
          if you also need ref of it
        - Type: `Ref<HtmlElement>`
        - required: false
      - preview:
        - Type: `() => VNode<any, any, any>`
        - required: false
      - onDragStart
        - Type: [`DndDragHandlerWithData<T>`](#dnddraghandlerwithdata-t)
        - required: false
      - startDirection
        - Description: the available start direction of dragging, only works
          with `usePointerEventProvider`
        - Type: [`StartDirection | Ref<StartDirection>`](#startdirection)
        - required: false
      - disabled
        - Description: disable this hook like it never applied
        - Type: `boolean` | `Ref<boolean>`
        - required: false

- Return
  - type: object
  - properties
    - propsItem
      - Description: item properties that need to be applied to elements
      - Type:  `ComputedRef<Record<string, any>>`
    - state
      - Description: state of the current drag target
      - Type: object
      - properties
        - isDragging
          - Description: is this item currently being dragged
          - Type: `ComputedRef<boolean>`

### useDroppable

## Components

### HtmlProvider

The with as [useHtmlProvider](#usehtmlprovider) except it is a component

### PointerEventProvider

The with as [usePointerEventProvider](#usepointereventprovider) except it is a component

## Interfaces

### DndDragHandlerWithData\<T\>

type: `(ev: DragEvent | PointerEvent, data: T) => void`

### StartDirection

type: `'all' | 'x' | 'y'`
