import{k as m,H as _}from"./framework-9002dd78.js";var a=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},u=a&&a.__extends||function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(o,r){o.__proto__=r}||function(o,r){for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(o[i]=r[i])},e(t,n)};return function(t,n){e(t,n);function o(){this.constructor=t}t.prototype=n===null?Object.create(n):(o.prototype=n.prototype,new o)}}();h=void 0;var f=function(){function e(){this.listeners=[]}return e.prototype.on=function(t){this.listeners.push({once:!1,callback:t})},e.prototype.once=function(t){var n=this;if(!t){var o=new Promise(function(r){n.once(r)});return this.listeners[this.listeners.length-1].promise=o,o}this.listeners.push({once:!0,callback:t})},e.prototype.off=function(t){var n=this.listeners.length;return this.listeners=this.listeners.filter(function(o){return t!==o.callback&&(!o.promise||t!==o.promise)}),this.listeners.length!==n},e.prototype.offAll=function(){var t=this.listeners.length;return this.listeners.length=0,t},e}();(function(e){u(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t})(f);function E(e){var t=e;function n(i){for(var s=t.listeners,v=s.length>0,l=0,c=s;l<c.length;l++){var g=c[l];g.callback(i)}return t.listeners=s.filter(function(d){var y=d.once;return!y}),v}var o=n;o.event=e,o.emit=n;var r=o;return r}var w=function(e){u(t,e);function t(){var n=e.call(this)||this;return n.emit=E(n),n}return t}(f),h=w;const p=Symbol("logger"),L=()=>{const e=new h,t=new Set,n=r=>{const i=(...s)=>r(...s);return t.add(i),()=>t.delete(i)},o=(...r)=>{e.emit(r)};return e.on(r=>{if(t.size>=0)for(const i of t)i(...r);else console.log(...r)}),_(p,o),{onLogged:n}},O=()=>m(p,(...t)=>console.log(...t));export{O as a,L as u};