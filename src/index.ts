import { ImageBitmapLoader } from "./lib/bitmap-loader";
import * as copyButton from "./lib/copy-button";
import * as presetButton from "./lib/preset-button";
import { MapSelector } from "./index/map-selector";
import { MapStorage } from "./lib/map-storage";
import { component, downloadCanvasPng, humanreadableDistance } from "./lib/utils";
import { GenerationInfoHandler } from "./index/generation-info-handler";
import { DtmHandler } from "./index/dtm-handler";
import { PrefabsHandler } from "./index/prefabs-handler";
import { DelayedRenderer } from "./lib/delayed-renderer";
import { CursorCoodsHandler } from "./index/cursor-coods-handler";
import { MarkerHandler } from "./index/marker-handler";
import { FileHandler } from "./index/file-handler";
import { MapCanvasHandler } from "./index/map-canvas-handler";
import { DndHandler } from "./index/dnd-handler";
import { SampleWorldLoader } from "./index/sample-world-loader";
import { LoadingHandler } from "./index/loading-handler";
import { TerrainViewer } from "./index/terrain-viewer";
import { UIHandler } from "./index/ui-handler";
import * as syncOutput from "./lib/sync-output";

function main() {
  presetButton.init();
  copyButton.init();
  syncOutput.init();

  // UI Initialization
  UIHandler();

  const loadingHandler = new LoadingHandler({
    indicator: component("loading_indicator"),
    disablings: {
      files: component("files", HTMLInputElement),
      select: component("map_list", HTMLSelectElement),
      create: component("create_map", HTMLButtonElement),
      delete: component("delete_map", HTMLButtonElement),
      mapName: component("map_name", HTMLInputElement),
    },
  });

  const mapStorage = new MapStorage();
  new MapSelector(
    {
      select: component("map_list", HTMLSelectElement),
      create: component("create_map", HTMLButtonElement),
      delete: component("delete_map", HTMLButtonElement),
      mapName: component("map_name", HTMLInputElement),
    },
    mapStorage
  );

  const mapCanvasHandler = new MapCanvasHandler(
    {
      canvas: component("map", HTMLCanvasElement),
      biomesAlpha: component("biomes_alpha", HTMLInputElement),
      splat3Alpha: component("splat3_alpha", HTMLInputElement),
      splat4Alpha: component("splat4_alpha", HTMLInputElement),
      radAlpha: component("rad_alpha", HTMLInputElement),
      signSize: component("sign_size", HTMLInputElement),
      signAlpha: component("sign_alpha", HTMLInputElement),
      brightness: component("brightness", HTMLInputElement),
      scale: component("scale", HTMLInputElement),
    },
    new Worker("worker/map-renderer.js"),
    mapStorage,
    loadingHandler
  );

  const generationInfoHandler = new GenerationInfoHandler(
    {
      mapName: component("map_name", HTMLInputElement),
      output: component("generation_info_output", HTMLTextAreaElement),
    },
    mapStorage
  );

  const terrainViewer = new TerrainViewer({
    output: component("terrain_viewer", HTMLCanvasElement),
    texture: component("map", HTMLCanvasElement),
    show: component("terrain_viewer_show", HTMLButtonElement),
    close: component("terrain_viewer_close", HTMLButtonElement),
    hud: component("terrarian_viewer_hud"),
  });

  mapCanvasHandler.addMapSizeListener((size) => {
    terrainViewer.markCanvasUpdate();
    if (terrainViewer.mapSize?.width === size.width && terrainViewer.mapSize.height === size.height) {
      return;
    }
    terrainViewer.mapSize = size;
    terrainViewer.updateElevations();
  });

  const dtmHandler = new DtmHandler(mapStorage, () => new Worker("worker/pngjs.js"));
  dtmHandler.addListener((dtm) => {
    if (terrainViewer.dtm === dtm) return;
    terrainViewer.dtm = dtm;
    terrainViewer.updateElevations();
  });

  const prefabsHandler = new PrefabsHandler(
    {
      status: component("prefabs_num", HTMLElement),
      prefabFilter: component("prefabs_filter", HTMLInputElement),
      blockFilter: component("blocks_filter", HTMLInputElement),
    },
    new Worker("worker/prefabs-filter.js"),
    mapStorage
  );
  const prefabListRenderer = new DelayedRenderer<HighlightedPrefab>(
    component("controller", HTMLElement),
    component("prefabs_list", HTMLElement),
    (p) => prefabLi(p)
  );
  prefabsHandler.listeners.push(async (prefabs) => {
    mapCanvasHandler.update({ prefabs });
    // Removing 3D Text at the moment until I stop the duplicate spawns on filter input click
    // terrainViewer.updatePOIText(prefabs);
    prefabListRenderer.iterator = prefabs;
  });

  const cursorCoodsHandler = new CursorCoodsHandler(
    {
      canvas: component("map", HTMLCanvasElement),
      xOutput: component("e-w", HTMLElement),
      zOutput: component("n-s", HTMLElement),
      yOutput: component("elev", HTMLElement),
    },
    (coords, size) => dtmHandler.dtm?.getElevation(coords, size) ?? null
  );
  mapCanvasHandler.addMapSizeListener((size) => (cursorCoodsHandler.mapSize = size));

  const markerHandler = new MarkerHandler(
    {
      canvas: component("map", HTMLCanvasElement),
      xOutput: component("mark-x", HTMLElement),
      zOutput: component("mark-z", HTMLElement),
      yOutput: component("mark-y", HTMLElement),
      resetMarker: component("reset_mark", HTMLButtonElement),
    },
    (coords, size) => dtmHandler.dtm?.getElevation(coords, size) ?? null
  );
  mapCanvasHandler.addMapSizeListener((size) => (markerHandler.mapSize = size));
  markerHandler.listeners.push(async (coords) => {
    prefabsHandler.marker = coords;
    mapCanvasHandler.update({ markerCoords: coords });
  });

  const imageLoader = new ImageBitmapLoader(() => new Worker("worker/pngjs.js"));
  const fileHandler = new FileHandler({ input: component("files", HTMLInputElement) }, loadingHandler);
  fileHandler.addListeners([
    ["biomes.png", async (file) => mapCanvasHandler.update({ biomesImg: await createImageBitmap(file) })],
    [/splat3(_processed)?\.png/, async (file) => mapCanvasHandler.update({ splat3Img: await imageLoader.loadSplat3(file) })],
    ["splat4_processed.png", async (file) => mapCanvasHandler.update({ splat4Img: await imageLoader.loadSplat4(file) })],
    ["radiation.png", async (file) => mapCanvasHandler.update({ radImg: await imageLoader.loadRad(file) })],
    ["prefabs.xml", async (file) => await prefabsHandler.handle(file)],
    [/dtm\.(raw|png)/, async (file) => await dtmHandler.handle(file)],
    ["GenerationInfo.txt", async (file) => await generationInfoHandler.handle(file)],
  ]);

  const dndHandler = new DndHandler(document);
  dndHandler.addDropFilesListener((files) => fileHandler.pushFiles(files));

  const sampleWorldLoader = new SampleWorldLoader();
  sampleWorldLoader.addListenr((f) => fileHandler.pushFiles([f]));

  component("download").addEventListener("click", () => {
    const mapName = component("map_name", HTMLInputElement).value ?? "7dtd-map";
    downloadCanvasPng(`${mapName}.png`, component("map", HTMLCanvasElement));
  });
}

function prefabLi(prefab: HighlightedPrefab) {
  const li = document.createElement("li");
  li.innerHTML = [
    `<button data-input-for="prefabs_filter" data-input-text="${prefab.name}" title="Filter with this prefab name" class="poi-filter-btn">▲</button>`,
    `<a href="prefabs/${prefab.name}.html" target="_blank">${prefab.highlightedName || prefab.name}</a>`,
    prefab.dist ? `<p class="poi-distance">Distance: ${humanreadableDistance(prefab.dist)}</p>` : "",
    `<div class="coord-holder">(<p class="e-w">${prefab.x}</p>, <p class="n-s">${prefab.z}</p>)</div>`,
  ].join(" ");
  if (prefab.matchedBlocks && prefab.matchedBlocks.length > 0) {
    const blocksUl = document.createElement("ul");
    blocksUl.classList.add("highlighted-block-info-ul");
    prefab.matchedBlocks.forEach((block) => {
      const blockLi = document.createElement("li");
      blockLi.innerHTML = [
        `<button data-input-for="blocks_filter" data-input-text="${block.name}" title="Filter with this block name" class="small-filter-btn">▲</button>`,
        `<small>${block.count}x ${block.highlightedLabel}<small>`,
        `${block.highlightedName}`,
      ].join(" ");
      blocksUl.appendChild(blockLi);
    });
    li.appendChild(blocksUl);
  }
  return li;
}

export function clearPrefabLi() {
  const prefabsList = document.getElementById("prefabs_list");
  while (prefabsList?.firstChild) {
    prefabsList?.removeChild(prefabsList?.firstChild);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
