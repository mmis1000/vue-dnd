import{u as i}from"./use-droppable-8c61267d.js";import"./PointerEventProvider-6f7d6b72.js";import{a as d}from"./example-util-57acbbd1.js";import{B as _}from"./type-10926332.js";import{c,p as l,q as m,s as u,Q as f,v as x,W as B,z as v,_ as g}from"./framework-9002dd78.js";const b={class:"label"},y=c({__name:"Box",props:{index:{type:String,required:!0}},emits:["drop"],setup(t,{emit:r}){const o=t,a=d(),{propsItem:n}=i(_.withFilter(e=>e[1]!==o.index),{onDrop:(e,[s,p])=>{a(`${s} from ${p} is dropped into ${o.index}`),r("drop",[s,o.index])}});return(e,s)=>(l(),m("div",B({class:"box"},v(n)),[u(e.$slots,"default",{},void 0,!0),f("span",b,x(t.index),1)],16))}});const q=g(y,[["__scopeId","data-v-b066fd17"],["__file","Box.vue"]]);export{q as default};