---
sidebar: auto
---

# Config

## Utilities

### createType\<T, Name = 'Unnamed'\>()

Utility that can be used to create a type token.

- Type arguments
  - `T`
    - Description: Data type associated with this Type
  - `Name`
    - Description: Optional human readable description

- Returns
  - [`Type<T, Name>`](#type-t-name-unnamed)

## Hooks

### useHtmlProvider()

hook that provides native dnd based dnd experience

- props
  - works with native file upload
- cons
  - does not work on touch devices

### usePointerEventProvider()

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
    - Type: [`Type<T>`](#type-t-name-unnamed)
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

### DragLayer

Container that the system used to render drag previews.

Must be put under a provider.

Preferably to be teleported to `<body>` to avoid overflow problems.

- Attributes
  - None

### HtmlProvider

The same as [useHtmlProvider](#usehtmlprovider) except it is a component

- Attributes
  - None

### PointerEventProvider

The same as [usePointerEventProvider](#usepointereventprovider) except it is a component

- Attributes
  - None

## Interfaces

### Type\<T, Name = 'Unnamed'\>

Magic type that represents a data type

Can only be created by [createType\<T, Name = 'Unnamed'\>()](#createtype-t-name-unnamed)

### DndDragHandlerWithData\<T\>

type: `(ev: DragEvent | PointerEvent, data: T) => void`

### StartDirection

type: `'all' | 'x' | 'y'`
