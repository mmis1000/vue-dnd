# Introduction

Vue dnd is a headless library.

It does not contain any predefined stylesheet by itself.  
It does not manipulate the DOM by itself  
And nor does it force you to use specific component as the drag target.

## How it works

It has 4 parts.

- A hook to run at top level to provide the environment.
- A hook to determine which element should be draggable.
- A hook to determine where you can drop the element.
- A optional component that renders customized drag preview.

The hooks runs at top level hosts drag and drop states and provide it to the
environment using provide/inject.

The hooks on drag target decorate the element to make it is draggable.

The hooks on drop target denotes where the element can drop.

And the optional Components renders preview from the top level in the container.
