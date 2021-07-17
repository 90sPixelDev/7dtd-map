(()=>{"use strict";var t={934:(t,e,a)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ImageBitmapHolder=void 0;const i=a(726);e.ImageBitmapHolder=class{constructor(t,e,a=1e4){var s;this.fallbackPromise=null,this.lastAccessAt=0,this.label=t,(s=e)instanceof Blob&&"image/png"===s.type.toLowerCase()?this._png=e:(this._png=i.imageBitmapToPngBlob(e),this.setImg(e)),this.imgAge=a}async get(){return this.lastAccessAt=Date.now(),this.img??this.fallbackPromise??this.getFallback()}async getFallback(){return this.fallbackPromise=this.getImageBitmap(),this.fallbackPromise}async getImageBitmap(){console.debug("Fallback",this.label);const t=await createImageBitmap(await this._png);return this.setImg(t),this.fallbackPromise=null,t}setImg(t){this.img=t,setTimeout((()=>this.expireImage()),this.imgAge)}expireImage(){Date.now()-this.lastAccessAt>this.imgAge?(console.debug("Expire",this.label),i.requireNonnull(this.img).close(),this.img=null):setTimeout((()=>this.expireImage()),this.imgAge)}}},902:(t,e,a)=>{Object.defineProperty(e,"__esModule",{value:!0});const i=a(934),s=a(847),n=a(726),o="🚩️";function l(t,{text:e,x:a,z:i,size:s}){t.lineWidth=Math.round(.2*s),t.strokeStyle="rgba(0, 0, 0, 0.8)",t.strokeText(e,a,i),t.lineWidth=Math.round(.1*s),t.strokeStyle="white",t.strokeText(e,a,i),t.fillText(e,a,i)}e.default=class{constructor(t,e){this.brightness="100%",this.markerCoords=null,this.scale=.1,this.showPrefabs=!0,this.prefabs=[],this.signSize=200,this.signAlpha=1,this.biomesAlpha=1,this.splat3Alpha=1,this.splat4Alpha=1,this.radAlpha=1,this.update=s.throttledInvoker((async()=>{console.time("MapUpdate"),await this.updateImmediately(),console.timeEnd("MapUpdate")})),this._biomesImg=null,this._splat3Img=null,this._splat4Img=null,this._radImg=null,this.canvas=t,this.fontFace=e}set biomesImg(t){this._biomesImg=t?new i.ImageBitmapHolder("biomes",t):null}set splat3Img(t){this._splat3Img=t?new i.ImageBitmapHolder("splat3",t):null}set splat4Img(t){this._splat4Img=t?new i.ImageBitmapHolder("splat4",t):null}set radImg(t){this._radImg=t?new i.ImageBitmapHolder("rad",t):null}async size(){const t=await Promise.all([this._biomesImg?.get(),this._splat3Img?.get(),this._splat4Img?.get()]);return n.gameMapSize({width:Math.max(...t.map((t=>t?.width??0))),height:Math.max(...t.map((t=>t?.height??0)))})}isBlank(){return!this._biomesImg&&!this._splat3Img&&!this._splat4Img}async updateImmediately(){if(this.isBlank())return this.canvas.width=1,void(this.canvas.height=1);const{width:t,height:e}=await this.size();this.canvas.width=t*this.scale,this.canvas.height=e*this.scale;const a=this.canvas.getContext("2d");a&&(a.scale(this.scale,this.scale),a.filter=`brightness(${this.brightness})`,this._biomesImg&&0!==this.biomesAlpha&&(a.globalAlpha=this.biomesAlpha,a.drawImage(await this._biomesImg.get(),0,0,t,e)),this._splat3Img&&0!==this.splat3Alpha&&(a.globalAlpha=this.splat3Alpha,a.drawImage(await this._splat3Img.get(),0,0,t,e)),this._splat4Img&&0!==this.splat4Alpha&&(a.globalAlpha=this.splat4Alpha,a.drawImage(await this._splat4Img.get(),0,0,t,e)),a.filter="none",this._radImg&&0!==this.radAlpha&&(a.globalAlpha=this.radAlpha,a.imageSmoothingEnabled=!1,a.drawImage(await this._radImg.get(),0,0,t,e),a.imageSmoothingEnabled=!0),a.globalAlpha=this.signAlpha,this.showPrefabs&&this.drawPrefabs(a,t,e),this.markerCoords&&this.drawMark(a,t,e))}drawPrefabs(t,e,a){t.font=`${this.signSize}px ${this.fontFace?.family??""}`,t.fillStyle="red",t.textAlign="center",t.textBaseline="middle";const i=e/2,s=a/2,n=Math.round(.01*this.signSize),o=Math.round(.05*this.signSize);for(let e=this.prefabs.length-1;e>=0;e-=1){const a=this.prefabs[e];l(t,{text:"✘",x:i+a.x+n,z:s-a.z+o,size:this.signSize})}}drawMark(t,e,a){if(!this.markerCoords)return;t.font=`${this.signSize}px ${this.fontFace?.family??""}`,t.fillStyle="red",t.textAlign="left",t.textBaseline="alphabetic";const i=e/2,s=a/2,n=-1*Math.round(.32*this.signSize),r=-1*Math.round(.1*this.signSize),h=i+this.markerCoords.x+n,m=s-this.markerCoords.z+r;l(t,{text:o,x:h,z:m,size:this.signSize}),t.strokeText(o,h,m),t.fillText(o,h,m)}}},847:(t,e,a)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.throttledInvoker=void 0;const i=a(726);e.throttledInvoker=function(t){const e=[];return()=>{switch(e.length){case 0:return e.push((async()=>{await t(),e.shift()})()),e[0];case 1:{const a=e[0];return e.push((async()=>{await a,await i.waitAnimationFrame(),await t(),e.shift()})()),e[1]}case 2:return e[1];default:throw Error(`Unexpected state: promiceses=${e.length}`)}}}},726:(t,e)=>{function a(t,e=(()=>`Unexpected state: ${t}`)){if(null!=t)return t;throw Error(e())}function i(t,e,a=(()=>`Unexpected type: ${t}`)){if(t instanceof e)return t;throw Error(a())}function s(t){return{type:"game",...t}}function n(t,e,a){const i=t.offsetX*e.width/a.width,n=t.offsetY*e.height/a.height;if(i<0||i>=e.width||n<0||n>=e.height)return null;const o=i-Math.floor(e.width/2),l=Math.floor(e.height/2)-n;return s({x:Math.round(o),z:Math.round(l)})}Object.defineProperty(e,"__esModule",{value:!0}),e.threePlaneSize=e.canvasEventToGameCoords=e.gameCoords=e.gameMapSize=e.sleep=e.imageBitmapToPngBlob=e.downloadCanvasPng=e.formatCoords=e.waitAnimationFrame=e.humanreadableDistance=e.removeAllChildren=e.component=e.requireType=e.requireNonnull=void 0,e.requireNonnull=a,e.requireType=i,e.component=function(t,e){const s=a(document.getElementById(a(t,(()=>`Element ID must not null: ${t}`))),(()=>`Element not found: #${t}`));return e?i(s,e):s},e.removeAllChildren=function(t){for(;t.lastChild;)t.removeChild(t.lastChild)},e.humanreadableDistance=function(t){return t<1e3?`${t}m`:`${(t/1e3).toFixed(2)}km`},e.waitAnimationFrame=function(){return new Promise((t=>requestAnimationFrame(t)))},e.formatCoords=function(t,e,a,i){if(!i)return"E/W: -, N/S: -, Elev: -";const s=n(i,t,e);if(null===s)return"E/W: -, N/S: -, Elev: -";const o=a(s,t)??"-";return`E/W: ${s.x}, N/S: ${s.z}, Elev: ${o}`},e.downloadCanvasPng=function(t,e){const a=document.createElement("a");a.download=t,a.href=e.toDataURL("image/png"),a.click()},e.imageBitmapToPngBlob=async function(t){const e=new OffscreenCanvas(t.height,t.width);return a(e.getContext("2d")).drawImage(t,0,0),await e.convertToBlob({type:"image/png"})},e.sleep=async function(t){return new Promise((e=>setTimeout(e,t)))},e.gameMapSize=function(t){return{type:"game",...t}},e.gameCoords=s,e.canvasEventToGameCoords=n,e.threePlaneSize=function(t,e){return{type:"threePlane",width:t,height:e}}},179:function(t,e,a){var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const s=i(a(902)),n=new FontFace("Noto Sans","url(../NotoEmoji-Regular.ttf)");let o=null;n.load().then((()=>{fonts.add(n),o?.update()})),onmessage=async t=>{const e=t.data;if(console.debug(e),!o){if(!e.canvas)throw Error("Unexpected state");o=new s.default(e.canvas,n)}await Object.assign(o,e).update(),postMessage({mapSize:await o.size()})}}},e={};!function a(i){var s=e[i];if(void 0!==s)return s.exports;var n=e[i]={exports:{}};return t[i].call(n.exports,n,n.exports,a),n.exports}(179)})();
//# sourceMappingURL=map-renderer.js.map