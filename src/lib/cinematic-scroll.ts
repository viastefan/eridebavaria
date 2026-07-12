import {
  type CinematicFrame,
  getActiveFrameIndex,
  getFrameOpacity,
  getLocalFrameProgress,
} from "./cinematic-frames";

export interface CachedLayer {
  host: HTMLElement;
  frameIndex: number;
  card: HTMLElement | null;
  copy: HTMLElement | null;
  hotspots: HTMLElement[];
}

export function buildLayerCache(root: HTMLElement): CachedLayer[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-frame-index]")).map((host) => ({
    host,
    frameIndex: Number(host.dataset.frameIndex),
    card: host.querySelector<HTMLElement>(".hero-showroom__card"),
    copy: host.querySelector<HTMLElement>(".hero-showroom__copy"),
    hotspots: Array.from(host.querySelectorAll<HTMLElement>("[data-hotspot-index]")),
  }));
}

export function updateCinematicLayers(
  cache: CachedLayer[],
  frames: CinematicFrame[],
  progress: number
) {
  const count = frames.length;
  const activeIndex = getActiveFrameIndex(progress, frames);

  for (const layer of cache) {
    const frame = frames[layer.frameIndex];
    if (!frame) continue;

    const opacity = getFrameOpacity(progress, frame, layer.frameIndex, count);
    const local = getLocalFrameProgress(progress, frame, layer.frameIndex, count);
    const visible = opacity > 0.06;
    const isActive = layer.frameIndex === activeIndex;

    layer.host.style.opacity = visible ? String(opacity) : "0";
    layer.host.style.visibility = visible ? "visible" : "hidden";
    layer.host.style.pointerEvents = isActive && opacity > 0.5 ? "auto" : "none";
    layer.host.style.zIndex = isActive ? "3" : String(2 + layer.frameIndex);
    layer.host.style.setProperty("--frame-local", String(local));

    if (layer.card) {
      layer.card.style.opacity = "";
      layer.card.style.transform = "";
    }

    if (layer.copy) {
      layer.copy.style.setProperty("--copy-y", "0px");
    }

    for (const spot of layer.hotspots) {
      if (!visible || !isActive) {
        spot.style.opacity = "0";
        spot.style.transform = "scale(0.92)";
        continue;
      }
      const spotIndex = Number(spot.dataset.hotspotIndex);
      const delay = spotIndex * 0.1;
      const spotLocal = Math.min(Math.max((local - delay) / (1 - delay), 0), 1);
      spot.style.opacity = String(spotLocal * opacity);
      spot.style.transform = `scale(${0.94 + spotLocal * 0.06})`;
    }
  }

  return activeIndex;
}
