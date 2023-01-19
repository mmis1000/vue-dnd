import{_ as d,M as l,p as r,q as c,N as n,V as s,a1 as o,Q as e,t as a}from"./framework-9002dd78.js";const p={},u=o('<h1 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting started</h1><h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2><ul><li>Vue 3.x</li></ul><h2 id="setup-environments" tabindex="-1"><a class="header-anchor" href="#setup-environments" aria-hidden="true">#</a> Setup environments</h2><h3 id="install-dependency" tabindex="-1"><a class="header-anchor" href="#install-dependency" aria-hidden="true">#</a> Install dependency</h3><p>Run the following command in a vue 3 project.</p>',6),h=e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token function"},"npm"),a(),e("span",{class:"token function"},"install"),a(` @mmis1000/vue-dnd
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"})])],-1),m=e("div",{class:"language-bash line-numbers-mode","data-ext":"sh"},[e("pre",{class:"language-bash"},[e("code",null,[e("span",{class:"token function"},"yarn"),a(),e("span",{class:"token function"},"install"),a(` @mmis1000/vue-dnd
`)])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"})])],-1),f=e("h3",{id:"add-a-provider",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#add-a-provider","aria-hidden":"true"},"#"),a(" Add a provider")],-1),v=e("p",null,"Install one of the provider on the top level of your project",-1),k=e("h4",{id:"html-provider",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#html-provider","aria-hidden":"true"},"#"),a(" HTML provider")],-1),g=e("p",null,"supports file upload but don't really works with touch devices",-1),b=e("div",{class:"language-diff line-numbers-mode","data-ext":"diff"},[e("pre",{class:"language-diff"},[e("code",null,[e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <script setup>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},` import { useHtmlProvider } from '@mmis1000/vue-dnd'
`),e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},` useHtmlProvider()
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <\/script>
`)])])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])],-1),_=e("div",{class:"language-diff line-numbers-mode","data-ext":"diff"},[e("pre",{class:"language-diff"},[e("code",null,[e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <template>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},`   <HtmlProvider>
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},`     <Page>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},`   </HtmlProvider>
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` </template>
`),e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <script setup>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},` import { HtmlProvider } from '@mmis1000/vue-dnd'
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <\/script>
`)])])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])],-1),x=e("h4",{id:"pointer-event-provider",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#pointer-event-provider","aria-hidden":"true"},"#"),a(" Pointer event provider")],-1),P=e("p",null,"works with touch devices, but don't support file upload",-1),H=e("div",{class:"language-diff line-numbers-mode","data-ext":"diff"},[e("pre",{class:"language-diff"},[e("code",null,[e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <script setup>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},` import { usePointerEventProvider } from '@mmis1000/vue-dnd'
`),e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},` usePointerEventProvider()
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <\/script>
`)])])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])],-1),C=e("div",{class:"language-diff line-numbers-mode","data-ext":"diff"},[e("pre",{class:"language-diff"},[e("code",null,[e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <template>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},`   <PointerEventProvider>
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},`     <Page>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},`   </PointerEvenProvider>
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` </template>
`),e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <script setup>
`)]),e("span",{class:"token inserted-sign inserted"},[e("span",{class:"token prefix inserted"},"+"),e("span",{class:"token line"},` import { PointerEvenProvider } from '@mmis1000/vue-dnd'
`)]),e("span",{class:"token unchanged"},[e("span",{class:"token prefix unchanged"}," "),e("span",{class:"token line"},` <\/script>
`)])])]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"}),e("div",{class:"line-number"})])],-1);function N(w,y){const i=l("CodeGroupItem"),t=l("CodeGroup");return r(),c("div",null,[u,n(t,null,{default:s(()=>[n(i,{title:"NPM"},{default:s(()=>[h]),_:1}),n(i,{title:"YARN"},{default:s(()=>[m]),_:1})]),_:1}),f,v,k,g,n(t,null,{default:s(()=>[n(i,{title:"Hook"},{default:s(()=>[b]),_:1}),n(i,{title:"HOC"},{default:s(()=>[_]),_:1})]),_:1}),x,P,n(t,null,{default:s(()=>[n(i,{title:"Hook"},{default:s(()=>[H]),_:1}),n(i,{title:"HOC"},{default:s(()=>[C]),_:1})]),_:1})])}const V=d(p,[["render",N],["__file","get-started.html.vue"]]);export{V as default};