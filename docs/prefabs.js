(()=>{"use strict";var e={550:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DelayedRenderer=void 0;const r=n(726);async function o(e,t){for(;!t();){const t=e._iterator.next();if(a(t))break;const n=new DocumentFragment;t.value.forEach((t=>n.appendChild(e.itemRenderer(t)))),e.appendee.appendChild(n),await(0,r.waitAnimationFrame)()}}function a(e){return Boolean(e.done)}t.DelayedRenderer=class{constructor(e,t,n){if(this._iterator=[][Symbol.iterator](),this.scrollCallback=()=>{this.renderAll()},!e.contains(t))throw Error("Wrapper element should contain appendee element");t.innerHTML="",this.appendee=t,this.scrollableWrapper=e,this.itemRenderer=n}set iterator(e){this._iterator=function(e,t=10){let n=null;const o={next(...r){if(n)return n;const o=Array(t);for(let i=0;i<t;i++){const t=e.next(...r);a(t)?n=t:o[i]=t.value}return{done:!1,value:o}}};return"throw"in e&&(o.throw=t=>{const n=(0,r.requireNonnull)(e.throw)(t);return a(n)?n:{done:n.done,value:[n.value]}}),"return"in e&&(o.return=t=>{const n=(0,r.requireNonnull)(e.return)(t);return a(n)?n:{done:n.done,value:[n.value]}}),o}("next"in e?e:e[Symbol.iterator]()),this.appendee.innerHTML="",this.scrollableWrapper.removeEventListener("scroll",this.scrollCallback),requestAnimationFrame((()=>{this.scrollableWrapper.removeEventListener("scroll",this.scrollCallback),this.scrollableWrapper.addEventListener("scroll",this.scrollCallback,{once:!0}),o(this,(()=>{return(e=this.scrollableWrapper).offsetHeight+100<e.scrollHeight;var e}))}))}async renderAll(){await o(this,(()=>!1))}}},110:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.init=void 0;const r=n(726);t.init=function(){document.body.addEventListener("click",(({target:e})=>{if(e instanceof HTMLButtonElement&&null!=e.dataset.inputFor){const t=(0,r.component)(e.dataset.inputFor,HTMLInputElement);t.value=(0,r.requireNonnull)(e.dataset.inputText??e.textContent),t.dispatchEvent(new Event("input"))}}))}},726:(e,t)=>{function n(e,t=(()=>`Unexpected state: ${e}`)){if(null!=e)return e;throw Error(t())}function r(e,t,n=(()=>`Unexpected type: ${e}`)){if(e instanceof t)return e;throw Error(n())}function o(e){return{type:"game",...e}}function a(e,t,n){const r=e.offsetX*t.width/n.width,a=e.offsetY*t.height/n.height;if(r<0||r>=t.width||a<0||a>=t.height)return null;const i=r-Math.floor(t.width/2),l=Math.floor(t.height/2)-a;return o({x:Math.round(i),z:Math.round(l)})}Object.defineProperty(t,"__esModule",{value:!0}),t.threePlaneSize=t.canvasEventToGameCoords=t.gameCoords=t.gameMapSize=t.sleep=t.imageBitmapToPngBlob=t.downloadCanvasPng=t.sendCoords=t.waitAnimationFrame=t.humanreadableDistance=t.removeAllChildren=t.component=t.requireType=t.requireNonnull=void 0,t.requireNonnull=n,t.requireType=r,t.component=function(e,t){const o=n(document.getElementById(n(e,(()=>`Element ID must not null: ${e}`))),(()=>`Element not found: #${e}`));return t?r(o,t):o},t.removeAllChildren=function(e){for(;e.lastChild;)e.removeChild(e.lastChild)},t.humanreadableDistance=function(e){return e<1e3?`${e}m`:`${(e/1e3).toFixed(2)}km`},t.waitAnimationFrame=function(){return new Promise((e=>requestAnimationFrame(e)))},t.sendCoords=function(e,t,n,r){if(!r)return{x:"-",z:"-",y:"-"};const o=a(r,e,t);if(null===o)return{x:"-",z:"-",y:"-"};const i=n(o,e)??"-";return{x:o.x,z:o.z,y:i}},t.downloadCanvasPng=function(e,t){const n=document.createElement("a");n.download=e,n.href=t.toDataURL("image/png"),n.click()},t.imageBitmapToPngBlob=async function(e){const t=new OffscreenCanvas(e.height,e.width);return n(t.getContext("2d")).drawImage(e,0,0),await t.convertToBlob({type:"image/png"})},t.sleep=async function(e){return new Promise((t=>setTimeout(t,e)))},t.gameMapSize=function(e){return{type:"game",...e}},t.gameCoords=o,t.canvasEventToGameCoords=a,t.threePlaneSize=function(e,t){return{type:"threePlane",width:e,height:t}}},19:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});const i=n(550),l=a(n(110)),s=n(726);function c(){l.init();const e=new u(new Worker("worker/prefabs-filter.js"));(0,s.component)("blocks_filter",HTMLInputElement).addEventListener("input",(t=>e.blockFilter=t.target.value)),fetch("prefab-block-index.json").then((async t=>{const n=Object.keys(await t.json()).map((e=>({name:e,x:0,z:0})));e.prefabs=n}));const t=new i.DelayedRenderer(document.body,(0,s.component)("prefabs_list"),(e=>function(e){const t=document.createElement("li");if(t.innerHTML=`<a href="prefabs/${e.name}.html" target="_blank">${e.highlightedName||e.name}</a>`,e.matchedBlocks&&e.matchedBlocks.length>0){const n=document.createElement("ul");e.matchedBlocks.forEach((e=>{const t=document.createElement("li");t.innerHTML=[`<button data-input-for="blocks_filter" data-input-text="${e.name}" title="Filter with this block name">▲</button>`,`${e.count}x`,e.highlightedLabel,`<small>${e.highlightedName}</small>`].join(" "),n.appendChild(t)})),t.appendChild(n)}return t}(e)));e.listeners.push((async e=>{t.iterator=e.prefabs}))}class u{constructor(e){this.listeners=[],this.worker=e,this.worker.addEventListener("message",(e=>{this.listeners.map((t=>t(e.data)))}))}set prefabs(e){this.worker.postMessage({all:e})}set blockFilter(e){this.worker.postMessage({blocksFilterString:e})}}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",c):c()}},t={};!function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}(19)})();
//# sourceMappingURL=prefabs.js.map