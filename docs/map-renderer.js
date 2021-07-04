(()=>{"use strict";var t={29:(t,e,n)=>{let a,i;n.r(e),n.d(e,{deleteDB:()=>f,openDB:()=>m,unwrap:()=>p,wrap:()=>u});const r=new WeakMap,s=new WeakMap,o=new WeakMap,c=new WeakMap,l=new WeakMap;let d={get(t,e,n){if(t instanceof IDBTransaction){if("done"===e)return s.get(t);if("objectStoreNames"===e)return t.objectStoreNames||o.get(t);if("store"===e)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return u(t[e])},set:(t,e,n)=>(t[e]=n,!0),has:(t,e)=>t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t};function h(t){return"function"==typeof t?(e=t)!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(p(this),t),u(r.get(this))}:function(...t){return u(e.apply(p(this),t))}:function(t,...n){const a=e.call(p(this),t,...n);return o.set(a,t.sort?t.sort():[t]),u(a)}:(t instanceof IDBTransaction&&function(t){if(s.has(t))return;const e=new Promise(((e,n)=>{const a=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",r),t.removeEventListener("abort",r)},i=()=>{e(),a()},r=()=>{n(t.error||new DOMException("AbortError","AbortError")),a()};t.addEventListener("complete",i),t.addEventListener("error",r),t.addEventListener("abort",r)}));s.set(t,e)}(t),n=t,(a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((t=>n instanceof t))?new Proxy(t,d):t);var e,n}function u(t){if(t instanceof IDBRequest)return function(t){const e=new Promise(((e,n)=>{const a=()=>{t.removeEventListener("success",i),t.removeEventListener("error",r)},i=()=>{e(u(t.result)),a()},r=()=>{n(t.error),a()};t.addEventListener("success",i),t.addEventListener("error",r)}));return e.then((e=>{e instanceof IDBCursor&&r.set(e,t)})).catch((()=>{})),l.set(e,t),e}(t);if(c.has(t))return c.get(t);const e=h(t);return e!==t&&(c.set(t,e),l.set(e,t)),e}const p=t=>l.get(t);function m(t,e,{blocked:n,upgrade:a,blocking:i,terminated:r}={}){const s=indexedDB.open(t,e),o=u(s);return a&&s.addEventListener("upgradeneeded",(t=>{a(u(s.result),t.oldVersion,t.newVersion,u(s.transaction))})),n&&s.addEventListener("blocked",(()=>n())),o.then((t=>{r&&t.addEventListener("close",(()=>r())),i&&t.addEventListener("versionchange",(()=>i()))})).catch((()=>{})),o}function f(t,{blocked:e}={}){const n=indexedDB.deleteDatabase(t);return e&&n.addEventListener("blocked",(()=>e())),u(n).then((()=>{}))}const g=["get","getKey","getAll","getAllKeys","count"],w=["put","add","delete","clear"],b=new Map;function y(t,e){if(!(t instanceof IDBDatabase)||e in t||"string"!=typeof e)return;if(b.get(e))return b.get(e);const n=e.replace(/FromIndex$/,""),a=e!==n,i=w.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!i&&!g.includes(n))return;const r=async function(t,...e){const r=this.transaction(t,i?"readwrite":"readonly");let s=r.store;return a&&(s=s.index(e.shift())),(await Promise.all([s[n](...e),i&&r.done]))[0]};return b.set(e,r),r}var v;v=d,d={...v,get:(t,e,n)=>y(t,e)||v.get(t,e,n),has:(t,e)=>!!y(t,e)||v.has(t,e)}},547:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.MapStorage=e.LARGE_OBJECT_TYPES=void 0;const a=n(29),i=n(726);function r(t,e,n){for(let a=e+1;a<=n;a++)1===a&&(t.createObjectStore("maps",{keyPath:"id",autoIncrement:!0}),t.createObjectStore("largeObjects",{keyPath:["mapId","type"]})),2===a&&t.createObjectStore("selectedMap",{keyPath:"id"})}e.LARGE_OBJECT_TYPES=["biomes","splat3","splat4","rad","elevations","subElevations","prefabs","generationInfo"],e.LARGE_OBJECT_TYPES;const s=[t=>console.log("MapStorage change current map",t)];async function o(t,e){return{id:await t.put("maps",{name:e}),name:e}}async function c(t){return t._db||(t._db=await a.openDB("7dtd-map",2,{upgrade:r})),t._db}function l(t){return e.LARGE_OBJECT_TYPES.includes(t)}async function d(t,e){await t.put("selectedMap",{id:0,mapId:e})}async function h(t){const e=await t.get("selectedMap",0);if(e)return e.mapId;const n=await t.getAll("maps");if(n[0])return await d(t,n[0].id),h(t);const a=await o(t,"New-World");return await d(t,a.id),h(t)}e.MapStorage=class{async put(t,e){const n=await c(this),a=await h(n);if(l(t))await n.put("largeObjects",{mapId:a,type:t,data:e});else{if("maps"!==t)throw Error(`Unreachable code: type=${t}`);await n.put("maps",{id:a,name:e})}}async getCurrent(t){const e=await c(this),n=await h(e);if(l(t))return await e.get("largeObjects",[n,t]);if("maps"===t)return i.requireNonnull(await e.get("maps",n),(()=>`Unexpected state: ${n}`));throw Error(`Unreachable code: ${t}`)}async listMaps(){return(await c(this)).getAll("maps")}async createMap(t="New-World"){const e=await c(this);return await o(e,t)}async deleteMap(t){const n=await c(this),a=t??await h(n);await Promise.all([n.delete("maps",a),...e.LARGE_OBJECT_TYPES.map((t=>n.delete("largeObjects",[a,t])))])}async changeMap(t){const e=await c(this);await Promise.all([d(e,t),...s.map((e=>e(t,this)))])}async currentId(){return h(await c(this))}static addListener(t){s.push(t)}}},407:function(t,e,n){var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const i=a(n(847)),r="🚩️";function s(t,{text:e,x:n,z:a,size:i}){t.lineWidth=Math.round(.2*i),t.strokeStyle="rgba(0, 0, 0, 0.8)",t.strokeText(e,n,a),t.lineWidth=Math.round(.1*i),t.strokeStyle="white",t.strokeText(e,n,a),t.fillText(e,n,a)}e.default=class{constructor(t){this.fontFace=null,this.canvas=t,this.showBiomes=!0,this.showSplat3=!0,this.showSplat4=!0,this.showRad=!0,this.showPrefabs=!0,this.biomesImg=null,this.splat3Img=null,this.splat4Img=null,this.radImg=null,this.brightness="100%",this.scale=.1,this.signSize=200,this.prefabs=[],new FontFace("Noto Sans","url(NotoEmoji-Regular.ttf)").load().then((t=>{this.fontFace=t,fonts.add(t)})),this.markerCoords=null,this.throttledUpdater=i.default((()=>this.updateImmediately()))}get width(){return Math.max(this.biomesImg?.width??0,this.splat3Img?.width??0,this.splat4Img?.width??0)}get height(){return Math.max(this.biomesImg?.height??0,this.splat3Img?.height??0,this.splat4Img?.height??0)}async update(){console.time("Map Update"),await this.throttledUpdater(),console.timeEnd("Map Update")}isBlank(){return!this.biomesImg&&!this.splat3Img&&!this.splat4Img}async updateImmediately(){if(this.isBlank())return this.canvas.width=1,void(this.canvas.height=1);this.canvas.width=this.width*this.scale,this.canvas.height=this.height*this.scale;const t=this.canvas.getContext("2d");t&&(t.scale(this.scale,this.scale),t.filter=`brightness(${this.brightness})`,this.biomesImg&&this.showBiomes&&t.drawImage(this.biomesImg,0,0,this.width,this.height),this.splat3Img&&this.showSplat3&&t.drawImage(this.splat3Img,0,0,this.width,this.height),this.splat4Img&&this.showSplat4&&t.drawImage(this.splat4Img,0,0,this.width,this.height),t.filter="none",this.radImg&&this.showRad&&(t.imageSmoothingEnabled=!1,t.drawImage(this.radImg,0,0,this.width,this.height),t.imageSmoothingEnabled=!0),this.showPrefabs&&function(t,e){e.font=`${t.signSize}px ${t.fontFace?.family??""}`,e.fillStyle="red",e.textAlign="center",e.textBaseline="middle";const n=t.width/2,a=t.height/2,i=Math.round(.01*t.signSize),r=Math.round(.05*t.signSize);for(let o=t.prefabs.length-1;o>=0;o-=1){const c=t.prefabs[o];s(e,{text:"✘",x:n+c.x+i,z:a-c.z+r,size:t.signSize})}}(this,t),this.markerCoords&&function(t,e){if(!t.markerCoords)return;e.font=`${t.signSize}px ${t.fontFace?.family??""}`,e.fillStyle="red",e.textAlign="left",e.textBaseline="alphabetic";const n=t.width/2,a=t.height/2,i=-1*Math.round(.32*t.signSize),o=-1*Math.round(.1*t.signSize),c=n+t.markerCoords.x+i,l=a-t.markerCoords.z+o;s(e,{text:r,x:c,z:l,size:t.signSize}),e.strokeText(r,c,l),e.fillText(r,c,l)}(this,t))}}},847:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0});const a=n(726);e.default=function(t){let e=!1,n=null;return async()=>{e=!0,n||(n=(async()=>{for(;e;)e=!1,await t(),await a.waitAnimationFrame();n=null})())}}},726:(t,e)=>{function n(t,e=(()=>`Unexpected state: ${t}`)){if(t)return t;throw Error(e())}function a(t,e,n=(()=>`Unexpected type: ${t}`)){if(t instanceof e)return t;throw Error(n())}Object.defineProperty(e,"__esModule",{value:!0}),e.downloadCanvasPng=e.formatCoords=e.waitAnimationFrame=e.humanreadableDistance=e.removeAllChildren=e.component=e.requireType=e.requireNonnull=void 0,e.requireNonnull=n,e.requireType=a,e.component=function(t,e){const i=document.getElementById(n(t));return e?a(n(i),e):n(i)},e.removeAllChildren=function(t){for(;t.lastChild;)t.removeChild(t.lastChild)},e.humanreadableDistance=function(t){return t<1e3?`${t}m`:`${(t/1e3).toFixed(2)}km`},e.waitAnimationFrame=function(){return new Promise((t=>requestAnimationFrame(t)))},e.formatCoords=function(t,e,n,a){if(!a)return"E/W: -, N/S: -, Elev: -";const i=a.offsetX*t.width/e.width,r=a.offsetY*t.height/e.height;return i<0||i>=t.width||r<0||r>=t.height?"E/W: -, N/S: -, Elev: -":`E/W: ${Math.round(i-t.width/2)}, N/S: ${Math.round(t.height/2-r)}, Elev: ${n({x:Math.round(i),z:Math.round(r)},t.width)??"-"}`},e.downloadCanvasPng=function(t,e){const n=document.createElement("a");n.download=t,n.href=e.toDataURL("image/png"),n.click()}},496:function(t,e,n){var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const i=a(n(407)),r=n(547),s={biomesImg:"biomes",splat3Img:"splat3",splat4Img:"splat4",radImg:"rad"};let o=null;const c=new r.MapStorage;onmessage=async t=>{const e=t.data;if(!o){if(!e.canvas)throw Error("Unexpected state");o=new i.default(e.canvas)}await Object.assign(o,e).update();for(const t of Object.entries(e))t[0]in s&&c.put(s[t[0]],t[1]);postMessage({mapSize:{width:o.width,height:o.height}})}}},e={};function n(a){var i=e[a];if(void 0!==i)return i.exports;var r=e[a]={exports:{}};return t[a].call(r.exports,r,r.exports,n),r.exports}n.d=(t,e)=>{for(var a in e)n.o(e,a)&&!n.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n(496)})();
//# sourceMappingURL=map-renderer.js.map