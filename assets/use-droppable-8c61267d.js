import{a as v,b,m as h}from"./PointerEventProvider-6f7d6b72.js";import{k as E,h as t,z as d,b as I,ag as D}from"./framework-9002dd78.js";const O=(u,r={})=>{const a=E(v);if(a==null)throw new Error("[vue-dnd] useDroppable must be used with a provider");const[o,s]=a.useDroppableDecorator({accept:u,...r}),l=e=>D(e,s(),!0),p=e=>e==null?s():h(e,s()),i=t(()=>a.readonlyExecutions.find(e=>e.targets.indexOf(o)>=0)!=null),c=t(()=>a.readonlyExecutions.map(n=>{const g=t(()=>b(u,n.initialDragEvent,n));return{hover:n.targets.indexOf(o)>=0,data:d(n.data),get accepted(){return g.value}}})),m=t(()=>{for(const e of c.value)if(e.accepted)return!0;return!1}),f=t(()=>a.readonlyExecutions.length>0);return{wrapItem:e=>r.disabled==null||!d(r.disabled)?l(e):e,propsItem:t(()=>r.disabled==null||!d(r.disabled)?p({ref:r.ref}):{ref:r.ref}),hoverState:I({hover:i,accepted:m,dragging:f,draggingItems:c})}};export{O as u};