# Introduction

Vue dnd is a headless library.

It does not contain any predefined stylesheet by itself.  
It does not manipulate the DOM by itself  
And nor does it force you to use the specific component as the drag target.

## How it works

It has 4 parts.

- A hook to run at the top level to provide the environment.
- A hook to determine which element should be draggable.
- A hook to determine where you can drop the element.
- An optional component that renders customized drag previews.

The hook run at the top level hosts drag and drop states and provides it to the
environment using provide/inject.

The hooks on drag target decorate the element to make it draggable.

The hooks on drop target denote where the element can drop.

And the optional Component renders previews from the top level in the container.
