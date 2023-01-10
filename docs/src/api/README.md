---
sidebar: auto
---

# API Reference

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
function useDraggable<T> (
  type: Type<T>,
  data: T,
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
    - optional
    - properties
      - ref
        - Description: ref container to contain target dom element
          if you also need ref of it
        - Type: `Ref<HtmlElement>`
        - optional
      - preview:
        - Type: `() => VNode<any, any, any>`
        - optional
      - onDragStart
        - Type: [`DndDragHandlerWithData<T>`](#dnddraghandlerwithdata-t)
        - optional
      - startDirection
        - Description: the available start direction of dragging, only works
          with `usePointerEventProvider`
        - Type: [`StartDirection | Ref<StartDirection>`](#startdirection)
        - optional
      - disabled
        - Description: disable this hook like it never applied
        - Type: `boolean` | `Ref<boolean>`
        - optional

- Return
  - type: object
  - properties
    - propsItem
      - Description: item properties that need to be applied to the element
      - Type:  `ComputedRef<Record<string, any>>`
    - state
      - Description: state of the current drag target
      - Type: object
      - properties
        - isDragging
          - Description: is this item currently being dragged
          - Type: `ComputedRef<boolean>`

### useDroppable

```ts

function useDroppable <T>(
  type: Type<T>,
  options
) : {
  propsItem: ComputedRef<Record<string, any>>,
  hoverState: {
    hover: boolean,
    accepted: boolean,
    dragging: boolean,
  }
}
```

- Arguments
  - type
    - Type: [`Type<T>`](#type-t-name-unnamed)
  - options
    - Type: object
    - properties
      - ref
        - Description: ref container to contain target dom element
          if you also need ref of it
        - Type: `Ref<HtmlElement>`
        - optional
      - onDrop
        - Type: [`DndDragHandlerWithData<T>`](#dnddraghandlerwithdata-t)
        - optional
      - onDragOver
        - Type: [`DndDragHandlerWithData<T>`](#dnddraghandlerwithdata-t)
        - optional
      - onDragEnter
        - Type: [`DndDragHandlerWithData<T>`](#dnddraghandlerwithdata-t)
        - optional
      - onDragLeave
        - Type: [`DndDragHandlerWithData<T>`](#dnddraghandlerwithdata-t)
        - optional
      - disabled
        - Description: disable this hook like it never applied
        - Type: `boolean` | `Ref<boolean>`
        - optional

- Return
  - type: object
  - properties
    - propsItem
      - Description: item properties that need to be applied to the element
      - Type:  `ComputedRef<Record<string, any>>`
    - state
      - Current state of a dnd provider and this drop zone
      - Type: object
      - properties
        - dragging
          - Description: Is there any item being dragged
          - Type: boolean
        - hover
          - Description: Whether this drop zone is being hovered
          - Type: boolean
        - accepted
          - Description: Whether this drop zone wishes to accept the dragging item
          - Type: boolean

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

- properties
  - `withFilter(fn: (value: T) => boolean) => Type<T, Name = 'Unnamed'>`
    - create a new drop zone type with filter applied

### NativeFile

A special type constant that catches all native drop events

- properties
  - `withFilter(fn: (value: DragEvent) => boolean) => NativeFile`
    - create a new drop zone type with filter applied

### DndDragHandlerWithData\<T\>

type: `(ev: DragEvent | PointerEvent, data: T) => void`

### StartDirection

type: `'all' | 'x' | 'y'`
