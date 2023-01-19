import{_ as c,M as a,p as l,q as u,Q as n,t as s,N as t,V as r,a1 as d}from"./framework-9002dd78.js";const k={},v=d(`<h1 id="multi-type-drop-zone" tabindex="-1"><a class="header-anchor" href="#multi-type-drop-zone" aria-hidden="true">#</a> Multi type drop zone</h1><p>Instead accept a single type of input. A drop zone can be configured to accept a list of inputs. And each of them can have different filter set.</p><h2 id="setup" tabindex="-1"><a class="header-anchor" href="#setup" aria-hidden="true">#</a> Setup</h2><p>Instead of accepting one type of items in previous example.</p><p>A Drop zone can have multi drop item at once by passing it as array</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// type BallDataType = [item: string, from: string]</span>
<span class="token keyword">type</span> <span class="token class-name">BallDataType</span> <span class="token operator">=</span> <span class="token punctuation">[</span>item<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> type<span class="token operator">:</span> <span class="token string">&#39;ball&#39;</span><span class="token punctuation">,</span> from<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> BallType <span class="token operator">=</span> <span class="token generic-function"><span class="token function">createType</span><span class="token generic class-name"><span class="token operator">&lt;</span>BallDataType<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">type</span> <span class="token class-name">PaperDataType</span> <span class="token operator">=</span> <span class="token punctuation">[</span>item<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> type<span class="token operator">:</span> <span class="token string">&#39;paper&#39;</span><span class="token punctuation">,</span> from<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> PaperType <span class="token operator">=</span> <span class="token generic-function"><span class="token function">createType</span><span class="token generic class-name"><span class="token operator">&lt;</span>PaperDataType<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><div class="highlight-line"> </div><div class="highlight-line"> </div><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> propsItem<span class="token punctuation">,</span> hoverState <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useDroppable</span><span class="token punctuation">(</span>
    <span class="token comment">// BallType.withFilter(([item, source]) =&gt; source !== props.index),</span>
    <span class="token punctuation">[</span>
        BallType<span class="token punctuation">.</span><span class="token function">withFilter</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">[</span>item<span class="token punctuation">,</span> type<span class="token punctuation">,</span> source<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> source <span class="token operator">!==</span> props<span class="token punctuation">.</span>index<span class="token punctuation">)</span><span class="token punctuation">,</span>
        PaperType<span class="token punctuation">.</span><span class="token function">withFilter</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">[</span>item<span class="token punctuation">,</span> type<span class="token punctuation">,</span> source<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> source <span class="token operator">!==</span> props<span class="token punctuation">.</span>index<span class="token punctuation">)</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        <span class="token function-variable function">onDrop</span><span class="token operator">:</span> <span class="token punctuation">(</span>ev<span class="token punctuation">,</span> <span class="token punctuation">[</span>data<span class="token punctuation">,</span> type<span class="token punctuation">,</span> source<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token comment">// console.log(\`\${data} from \${source} is dropped into \${props.index}\`)</span>
            <span class="token comment">// emit(&#39;drop&#39;, [data,props.index])</span>
            <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">type</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>source<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> is dropped into </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>props<span class="token punctuation">.</span>index<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
            <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">&#39;drop&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>data<span class="token punctuation">,</span> type<span class="token punctuation">,</span> props<span class="token punctuation">.</span>index<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),h=n("code",null,"data",-1),m=n("code",null,"onDrop",-1),g={href:"https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions",target:"_blank",rel:"noopener noreferrer"},b=n("h2",{id:"result",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#result","aria-hidden":"true"},"#"),s(" Result")],-1),y=n("p",null,"You can only drag item into the box specified",-1);function f(_,x){const p=a("ExternalLinkIcon"),e=a("example-multi-type-drop-zone-app"),o=a("example-wrapper");return l(),u("div",null,[v,n("p",null,[s("The "),h,s(" that "),m,s(" received will be a union of all types specified and can be handled safely with typescript "),n("a",g,[s("Discriminating Unions"),t(p)])]),b,y,t(o,{title:"example",source:"https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleMultiTypeDropZone/App.vue","client-only":"",options:[{name:"provider",type:"radio",value:"html",options:[{text:"HTML",value:"html"},{text:"Pointer",value:"pointer"}]}]},{default:r(({provider:i})=>[t(e,{provider:i},null,8,["provider"])]),_:1})])}const T=c(k,[["render",f],["__file","multi-type-drop-zone.html.vue"]]);export{T as default};
