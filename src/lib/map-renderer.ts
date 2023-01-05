import { ImageBitmapHolder } from "./image-bitmap-holder";
import { throttledInvoker } from "./throttled-invoker";
import { gameMapSize } from "./utils";

// const SIGN_CHAR = "✘";
const MARK_CHAR = "🚩️";

export default class MapRenderer {
  brightness = "100%";
  markerCoords: GameCoords | null = null;
  scale = 0.1;
  showPrefabs = true;
  prefabs: HighlightedPrefab[] = [];
  signSize = 200;
  markerSize = 100;
  signAlpha = 1;
  biomesAlpha = 1;
  splat3Alpha = 1;
  splat4Alpha = 1;
  radAlpha = 1;

  canvas: OffscreenCanvas;

  update = throttledInvoker(async () => {
    console.time("MapUpdate");
    await this.updateImmediately();
    console.timeEnd("MapUpdate");
  });

  private _biomesImg: ImageBitmapHolder | null = null;
  private _splat3Img: ImageBitmapHolder | null = null;
  private _splat4Img: ImageBitmapHolder | null = null;
  private _radImg: ImageBitmapHolder | null = null;
  private fontFace: FontFace;

  constructor(canvas: OffscreenCanvas, fontFace: FontFace) {
    this.canvas = canvas;
    this.fontFace = fontFace;
  }

  set biomesImg(img: ImageBitmap | PngBlob | null) {
    this._biomesImg = img ? new ImageBitmapHolder("biomes", img) : null;
  }
  set splat3Img(img: ImageBitmap | PngBlob | null) {
    this._splat3Img = img ? new ImageBitmapHolder("splat3", img) : null;
  }
  set splat4Img(img: ImageBitmap | PngBlob | null) {
    this._splat4Img = img ? new ImageBitmapHolder("splat4", img) : null;
  }
  set radImg(img: ImageBitmap | PngBlob | null) {
    this._radImg = img ? new ImageBitmapHolder("rad", img) : null;
  }

  async size(): Promise<GameMapSize> {
    const rects = await Promise.all([this._biomesImg?.get(), this._splat3Img?.get(), this._splat4Img?.get()]);
    return gameMapSize({
      width: Math.max(...rects.map((r) => r?.width ?? 0)),
      height: Math.max(...rects.map((r) => r?.height ?? 0)),
    });
  }

  private isBlank(): boolean {
    return !this._biomesImg && !this._splat3Img && !this._splat4Img;
  }

  async updateImmediately(): Promise<void> {
    if (this.isBlank()) {
      this.canvas.width = 1;
      this.canvas.height = 1;
      return;
    }

    const { width, height } = await this.size();

    this.canvas.width = width * this.scale;
    this.canvas.height = height * this.scale;

    const context = this.canvas.getContext("2d");
    if (!context) return;
    context.scale(this.scale, this.scale);
    context.filter = `brightness(${this.brightness})`;

    if (this._biomesImg && this.biomesAlpha !== 0) {
      context.globalAlpha = this.biomesAlpha;
      context.drawImage(await this._biomesImg.get(), 0, 0, width, height);
    }
    if (this._splat3Img && this.splat3Alpha !== 0) {
      context.globalAlpha = this.splat3Alpha;
      context.drawImage(await this._splat3Img.get(), 0, 0, width, height);
    }
    if (this._splat4Img && this.splat4Alpha !== 0) {
      context.globalAlpha = this.splat4Alpha;
      context.drawImage(await this._splat4Img.get(), 0, 0, width, height);
    }

    context.filter = "none";
    if (this._radImg && this.radAlpha !== 0) {
      context.globalAlpha = this.radAlpha;
      context.imageSmoothingEnabled = false;
      context.drawImage(await this._radImg.get(), 0, 0, width, height);
      context.imageSmoothingEnabled = true;
    }

    context.globalAlpha = this.signAlpha;
    if (this.showPrefabs) {
      this.drawPrefabs(context, width, height);
    }
    if (this.markerCoords) {
      this.drawMark(context, width, height);
    }
  }

  private customizeSignByPrefabCategory(prefab: HighlightedPrefab) {
    const pfName = prefab.name.toLocaleLowerCase();
    if (pfName.includes("gas")) {
      const prefabInfo = { text: "⛽", ctx: { fillStyle: "red", strokeStyle: "#5E1616" } };
      return prefabInfo;
    } else if (pfName.includes("trader")) {
      const prefabInfo = { text: "💰", ctx: { fillStyle: "yellow", strokeStyle: "#A47D00" } };
      return prefabInfo;
    } else if (pfName.includes("sham")) {
      const prefabInfo = { text: "🥫", ctx: { fillStyle: "yellow", strokeStyle: "white" } };
      return prefabInfo;
    } else if (pfName.includes("farm") || pfName.includes("barn")) {
      const prefabInfo = { text: "🚜", ctx: { fillStyle: "orange", strokeStyle: "#704D17" } };
      return prefabInfo;
    } else if (pfName.includes("survivor")) {
      const prefabInfo = { text: "👤", ctx: { fillStyle: "purple", strokeStyle: "#17072C" } };
      return prefabInfo;
    } else if (pfName.includes("skyscraper")) {
      const prefabInfo = { text: "🏢", ctx: { fillStyle: "#8FA5CF", strokeStyle: "#1C2F51" } };
      return prefabInfo;
    } else if (pfName.includes("hospital") || pfName.includes("clinic") || pfName.includes("pharmacy")) {
      const prefabInfo = { text: "💊", ctx: { fillStyle: "#2671FF", strokeStyle: "white" } };
      return prefabInfo;
    } else if (pfName.includes("book")) {
      const prefabInfo = { text: "📖", ctx: { fillStyle: "#44F3FF", strokeStyle: "#147178" } };
      return prefabInfo;
    } else {
      const prefabInfo = { text: "❌", ctx: { fillStyle: "white", strokeStyle: "#000" } };
      return prefabInfo;
    }
  }

  private drawPrefabs(ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) {
    const offsetX = width / 2;
    const offsetY = height / 2;

    const charOffsetX = Math.round(this.signSize * 0.01);
    const charOffsetY = Math.round(this.signSize * 0.05);

    // Inverted iteration to overwrite signs by higher order prefabs
    for (let i = this.prefabs.length - 1; i >= 0; i -= 1) {
      const prefab = this.prefabs[i];
      const x = offsetX + prefab.x + charOffsetX;
      // prefab vertical positions are inverted for canvas coodinates
      const z = offsetY - prefab.z + charOffsetY;
      // putText(ctx, { text: SIGN_CHAR, x, z, size: this.signSize });

      const prefabInfo = this.customizeSignByPrefabCategory(prefab);

      ctx.font = `${this.signSize}px ${this.fontFace?.family ?? ""}`;
      ctx.fillStyle = prefabInfo.ctx.fillStyle;
      ctx.strokeStyle = prefabInfo.ctx.strokeStyle;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      putText(ctx, { text: prefabInfo.text, x, z, size: this.signSize });
    }
  }

  private drawMark(ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) {
    if (!this.markerCoords) return;

    ctx.font = `${this.markerSize}px ${this.fontFace?.family ?? ""}`;
    ctx.fillStyle = "red";
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = -2;
    ctx.shadowBlur = 5;
    ctx.strokeStyle = "#830000";
    ctx.shadowColor = "rgba(75,75,75,0.75)";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const offsetX = width / 2;
    const offsetY = height / 2;
    const charOffsetX = -1 * Math.round(this.markerSize * 0.32);
    const charOffsetY = -1 * Math.round(this.markerSize * 0.1);

    const x = offsetX + this.markerCoords.x + charOffsetX;
    const z = offsetY - this.markerCoords.z + charOffsetY;

    putText(ctx, { text: MARK_CHAR, x, z, size: this.markerSize });
    ctx.fillText(MARK_CHAR, x, z);
  }
}

interface MapSign {
  text: string;
  x: number;
  z: number;
  size: number;
}

function putText(ctx: OffscreenCanvasRenderingContext2D, { text, x, z, size }: MapSign) {
  ctx.lineWidth = Math.round(size * 0.2);
  // ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
  ctx.strokeText(text, x, z);

  ctx.lineWidth = Math.round(size * 0.1);
  // ctx.strokeStyle = "white";
  ctx.strokeText(text, x, z);

  ctx.fillText(text, x, z);
}
