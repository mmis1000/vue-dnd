import{_ as e,M as n,p as o,q as i,N as s,V as l,a1 as c}from"./framework-9002dd78.js";const u={},r=c(`<h1 id="dropping-zone-state" tabindex="-1"><a class="header-anchor" href="#dropping-zone-state" aria-hidden="true">#</a> Dropping zone state</h1><p>Besides make the item being dragged transparent.</p><p>You may want to give users a hint about where you can drop the item.</p><p>So we expose a few useful states to the dropping zone.</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// const { propsItem } = useDroppable(/* ... */)</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> propsItem<span class="token punctuation">,</span> hoverState <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useDroppable</span><span class="token punctuation">(</span><span class="token comment">/* ... */</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="useful-properties" tabindex="-1"><a class="header-anchor" href="#useful-properties" aria-hidden="true">#</a> Useful properties</h2><p>The hoverState has a few properties, there are 3 that we want to focus on here</p><ul><li><code>dragging</code>: whether there is any ongoing dnd</li><li><code>hover</code>: whether the dragging item is currently on the top of this drop zone</li><li><code>accepted</code>: whether the current dropzone wishes to accept this dragging item</li></ul><h2 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example</h2><p>Let&#39;s try to add a background to indicate whether it is allowed to be dropped into the container</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
        <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>box<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name">:style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>extraStyle<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name">v-bind</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>propsItem<span class="token punctuation">&quot;</span></span>
    <span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&#39;</span>ts<span class="token punctuation">&#39;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> useDroppable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@mmis1000/vue-dnd&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> BallType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./type&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token function">defineProps</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
        <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> emit <span class="token operator">=</span> defineEmits<span class="token operator">&lt;</span><span class="token punctuation">{</span>
    <span class="token punctuation">(</span>ev<span class="token operator">:</span> <span class="token string">&#39;drop&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">item</span><span class="token operator">:</span> <span class="token punctuation">[</span>item<span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">target</span><span class="token operator">:</span> string<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token punctuation">{</span> propsItem<span class="token punctuation">,</span> hoverState <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useDroppable</span><span class="token punctuation">(</span>
    BallType<span class="token punctuation">.</span><span class="token function">withFilter</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>item<span class="token punctuation">,</span> source<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> source <span class="token operator">!==</span> props<span class="token punctuation">.</span>index<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        <span class="token function-variable function">onDrop</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">ev<span class="token punctuation">,</span> <span class="token punctuation">[</span>data<span class="token punctuation">,</span> source<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>source<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> is dropped into </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>props<span class="token punctuation">.</span>index<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
            <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">&#39;drop&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>data<span class="token punctuation">,</span> props<span class="token punctuation">.</span>index<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> extraStyle <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>hoverState<span class="token punctuation">.</span>dragging<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// we aren&#39;t even dragging</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>hoverState<span class="token punctuation">.</span>hover<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>hoverState<span class="token punctuation">.</span>accepted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;green&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;red&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>hoverState<span class="token punctuation">.</span>accepted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;blue&#39;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">
<span class="token comment">/* ... */</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="result" tabindex="-1"><a class="header-anchor" href="#result" aria-hidden="true">#</a> Result</h2>`,12);function d(k,v){const a=n("example-dropping-state-app"),t=n("example-wrapper");return o(),i("div",null,[r,s(t,{title:"example",source:"https://github.com/mmis1000/vue-dnd/blob/master/docs/src/.vuepress/components/ExampleDroppingState/App.vue",options:[{name:"provider",type:"radio",value:"html",options:[{text:"HTML",value:"html"},{text:"Pointer",value:"pointer"}]}]},{default:l(({provider:p})=>[s(a,{provider:p},null,8,["provider"])]),_:1})])}const g=e(u,[["render",d],["__file","dropping-state.html.vue"]]);export{g as default};