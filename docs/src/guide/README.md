# Introduction

Vue dnd is a headless library.

It does not contain any predefined stylesheet by itself.  
It does not manipulate the dDOM by itself  
And nor does it force you to use specific component as the drag target.

## Contents

It has 4 parts.

- A hook to run at top level to provide the environment.
- A hook to determine which element should be draggable.
- A hook to determine where you can drop the element.
- A optional component that renders customized drag preview.
