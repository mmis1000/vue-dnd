import c from"./Ball-8577ea93.js";import _ from"./Box-5af3a031.js";import{H as v,P as B}from"./PointerEventProvider-6f7d6b72.js";import{c as k,r as P,p as t,U as s,V as o,q as l,O as m,P as p,ad as h,z as u,_ as x}from"./framework-9002dd78.js";import"./use-draggable-e2b37517.js";import"./type-2e513d57.js";import"./use-droppable-8c61267d.js";import"./example-util-57acbbd1.js";const y=k({__name:"App",props:{provider:{type:String,default:"html"}},setup(d){const n=P([{id:"A",items:["a","b"]},{id:"B",items:[]},{id:"C",items:[]}]),f=([i,a])=>{n.value=n.value.map(e=>e.id===a?{...e,items:[...e.items.filter(r=>r!==i),i]}:{...e,items:e.items.filter(r=>r!==i)})};return(i,a)=>(t(),s(h(d.provider==="html"?u(v):u(B)),null,{default:o(()=>[(t(!0),l(m,null,p(n.value,e=>(t(),s(_,{index:e.id,key:e.id,onDrop:f},{default:o(()=>[(t(!0),l(m,null,p(e.items,r=>(t(),s(c,{key:r,index:r},null,8,["index"]))),128))]),_:2},1032,["index"]))),128))]),_:1}))}}),z=x(y,[["__file","App.vue"]]);export{z as default};
