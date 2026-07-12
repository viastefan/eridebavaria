"use client";

import { useRef, useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type CinematicHeroConfig,
  type CinematicFrame,
  type HeadlineWord,
  type ShowroomProductCard,
  containerTransform,
  wordsFromHeadline,
} from "@/lib/cinematic-frames";
import { buildLayerCache, updateCinematicLayers, type CachedLayer } from "@/lib/cinematic-scroll";
import { HERO_SCROLL_VH_MOBILE } from "@/lib/hero-journey";
import { useSmoothScrollReady } from "@/components/providers/SmoothScrollProvider";
import { useTheme } from "@teispace/next-themes";
import { formatFinancingHint, formatPrice } from "@/lib/products";
import { availabilityLabels } from "@/lib/labels";
import { useStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SCRUB_FPS = 18;
const VIDEO_FRAME_STEP = 1 / VIDEO_SCRUB_FPS;

function quantizeVideoTime(time: number, duration: number) {
  const max = Math.max(duration - 0.001, 0);
  const clamped = Math.min(Math.max(time, 0), max);
  return Math.round(clamped / VIDEO_FRAME_STEP) * VIDEO_FRAME_STEP;
}

function getNavOffset() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--hero-nav-offset")
    .trim();
  return value ? parseFloat(value) * 16 : 68;
}

interface CinematicScrollHeroProps {
  config: CinematicHeroConfig;
  id?: string;
  markHeroActive?: boolean;
}

function T1Headline({ words }: { words: HeadlineWord[][] }) {
  return (
    <h1 className="heading-cinematic-t1">
      {words.map((line, li) => (
        <span key={`line-${li}`} className="heading-cinematic-t1__line">
          {line.map((word, wi) => (
            <span
              key={`${li}-${wi}-${word.text}`}
              className={word.muted ? "heading-cinematic-t1__muted" : undefined}
            >
              {word.text}
              {wi < line.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function ShowroomProductCardLink({ card }: { card: ShowroomProductCard }) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!card.productId || !card.price) return;
    addToCart({
      productId: card.productId,
      name: card.model,
      price: card.price,
      image: card.image,
    });
  };

  return (
    <div className="hero-showroom__card">
      <div className="hero-showroom__card-header">
        {card.availability && (
          <span className={`hero-showroom__card-stock hero-showroom__card-stock--${card.availability}`}>
            <span className="hero-showroom__card-stock-dot" aria-hidden />
            {availabilityLabels[card.availability]}
          </span>
        )}
        <Link href={card.href} className="hero-showroom__card-model-link">
          <p className="hero-showroom__card-model">{card.model}</p>
        </Link>
        {card.price != null && (
          <div className="hero-showroom__card-pricing">
            <p className="hero-showroom__card-price">{formatPrice(card.price)}</p>
            <p className="hero-showroom__card-finance">{formatFinancingHint(card.price)}</p>
          </div>
        )}
      </div>

      <div className="hero-showroom__card-body">
        <p className="hero-showroom__card-prompt-text">{card.prompt}</p>
        <div className="hero-showroom__card-actions">
          <Link href={card.ctaHref ?? "/#beratung"} className="hero-showroom__card-cta hero-showroom__card-cta--primary">
            {card.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
          {card.productId && card.price != null && (
            <button
              type="button"
              className="hero-showroom__card-cta hero-showroom__card-cta--secondary"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
              In den Warenkorb
            </button>
          )}
        </div>
        <p className="hero-showroom__card-trust">Persönliche Rückmeldung · 24h</p>
      </div>
    </div>
  );
}

function FrameShowroomLeft({ frame }: { frame: CinematicFrame }) {
  return (
    <div className="hero-cinematic__layer hero-cinematic__layer--showroom">
      <div
        className={cn(
          "hero-showroom__copy",
          frame.hideHeaderMeta && "hero-showroom__copy--opening"
        )}
      >
        {!frame.hideHeaderMeta && (
          <p className="hero-cinematic__chapter-label">{frame.chapter}</p>
        )}
        {!frame.hideHeaderMeta && frame.vehicleType && (
          <p className="hero-showroom__vehicle-type">{frame.vehicleType}</p>
        )}
        <T1Headline words={wordsFromHeadline(frame)} />
        {frame.description && (
          <p className="hero-cinematic__desc hero-cinematic__desc--t1">{frame.description}</p>
        )}

        {frame.specs && frame.specs.length > 0 && (
          <div className="hero-showroom__specs">
            {frame.specs.map((spec) => (
              <div key={spec.label} className="hero-showroom__spec">
                <span className="hero-showroom__spec-label">{spec.label}</span>
                <span className="hero-showroom__spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {(frame.primaryCta || frame.secondaryCta) && (
          <div className="hero-cinematic__actions">
            {frame.primaryCta && (
              <Link href={frame.primaryCta.href} className="hero-cinematic__btn hero-cinematic__btn--primary">
                {frame.primaryCta.label}
              </Link>
            )}
            {frame.secondaryCta && (
              <Link href={frame.secondaryCta.href} className="hero-cinematic__btn hero-cinematic__btn--ghost">
                {frame.secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {frame.productCard && <ShowroomProductCardLink card={frame.productCard} />}
    </div>
  );
}

function FrameIntroLeft({ frame }: { frame: CinematicFrame }) {
  return (
    <div className="hero-cinematic__layer hero-cinematic__layer--intro">
      <div className="hero-cinematic__intro">
        <p className="hero-cinematic__chapter-label">{frame.chapter}</p>
        <h1 className="heading-cinematic">
          {wordsFromHeadline(frame).map((line, li) => (
            <span key={`intro-${li}`} className="heading-cinematic__line">
              {line.map((word, wi) => (
                <span
                  key={`${li}-${wi}`}
                  className={word.muted ? "heading-cinematic__muted" : undefined}
                >
                  {word.text}
                  {wi < line.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          ))}
        </h1>
        {frame.description && (
          <p className="hero-cinematic__desc">{frame.description}</p>
        )}
        <div className="hero-cinematic__actions">
          {frame.primaryCta && (
            <Link href={frame.primaryCta.href} className="hero-cinematic__btn hero-cinematic__btn--primary">
              {frame.primaryCta.label}
            </Link>
          )}
          {frame.secondaryCta && (
            <Link href={frame.secondaryCta.href} className="hero-cinematic__btn hero-cinematic__btn--ghost">
              {frame.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>

      {frame.stat && (
        <div className="hero-cinematic__glass hero-cinematic__glass--in-frame hero-cinematic__glass--intro">
          <p className="hero-cinematic__glass-label">{frame.stat.label}</p>
          <p className="hero-cinematic__glass-value">{frame.stat.value}</p>
          {frame.stat.image && (
            <div className="hero-cinematic__glass-thumb">
              <Image src={frame.stat.image} alt="" fill className="object-cover" sizes="120px" />
              <span className="hero-cinematic__glass-play" aria-hidden>
                <Play className="h-3 w-3" fill="currentColor" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FrameT1Left({ frame }: { frame: CinematicFrame }) {
  return (
    <div className="hero-cinematic__layer hero-cinematic__layer--t1">
      <div className="hero-cinematic__copy-fixed">
        <p className="hero-cinematic__chapter-label">{frame.chapter}</p>
        <T1Headline words={wordsFromHeadline(frame)} />
        {frame.description && (
          <p className="hero-cinematic__desc hero-cinematic__desc--t1">{frame.description}</p>
        )}
        {(frame.primaryCta || frame.secondaryCta) && (
          <div className="hero-cinematic__actions">
            {frame.primaryCta && (
              <Link href={frame.primaryCta.href} className="hero-cinematic__btn hero-cinematic__btn--primary">
                {frame.primaryCta.label}
              </Link>
            )}
            {frame.secondaryCta && (
              <Link href={frame.secondaryCta.href} className="hero-cinematic__btn hero-cinematic__btn--ghost">
                {frame.secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {frame.stat && (
        <div className="hero-cinematic__glass hero-cinematic__glass--in-frame hero-cinematic__glass--t1">
          <p className="hero-cinematic__glass-label">{frame.stat.label}</p>
          <p className="hero-cinematic__glass-value">{frame.stat.value}</p>
          {frame.stat.image && (
            <div className="hero-cinematic__glass-thumb">
              <Image src={frame.stat.image} alt="" fill className="object-cover" sizes="120px" />
              <span className="hero-cinematic__glass-play" aria-hidden>
                <Play className="h-3 w-3" fill="currentColor" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FrameT1Hotspots({ frame }: { frame: CinematicFrame }) {
  return (
    <div className="hero-cinematic__layer hero-cinematic__layer--t1">
      <div className="hero-cinematic__copy-fixed">
        <p className="hero-cinematic__chapter-label">{frame.chapter}</p>
        <T1Headline words={wordsFromHeadline(frame)} />
        {frame.description && (
          <p className="hero-cinematic__desc hero-cinematic__desc--t1">{frame.description}</p>
        )}
      </div>

      {frame.hotspots?.map((spot, i) => (
        <div
          key={spot.label}
          className="hero-cinematic__hotspot"
          data-hotspot-index={i}
          style={{
            top: spot.top,
            left: spot.left,
            right: spot.right,
          }}
        >
          <span className="hero-cinematic__hotspot-label">{spot.label}</span>
          <div className="hero-cinematic__hotspot-media">
            <Image src={spot.image} alt={spot.label} fill className="object-cover" sizes="200px" />
            <span className="hero-cinematic__hotspot-play" aria-hidden>
              <Play className="h-3.5 w-3.5" fill="currentColor" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FrameLayer({ frame, index }: { frame: CinematicFrame; index: number }) {
  const inner = (() => {
    switch (frame.layout) {
      case "showroom-left":
        return <FrameShowroomLeft frame={frame} />;
      case "intro-left":
        return <FrameIntroLeft frame={frame} />;
      case "t1-left":
        return <FrameT1Left frame={frame} />;
      case "t1-hotspots":
        return <FrameT1Hotspots frame={frame} />;
      default:
        return null;
    }
  })();

  if (!inner) return null;

  return (
    <div className="hero-cinematic__layer-host" data-frame-index={index}>
      {inner}
    </div>
  );
}

export function CinematicScrollHero({
  config,
  id = "hero",
  markHeroActive = true,
}: CinematicScrollHeroProps) {
  const scrollReady = useSmoothScrollReady();
  const { resolvedTheme } = useTheme();
  const {
    frames,
    videoSrc,
    videoSrcLight,
    videoFallback,
    posterSrc,
    imageSequence,
    scrollVh = 720,
    fullscreen = false,
  } = config;

  const activeVideoSrc =
    resolvedTheme === "light"
      ? videoSrcLight ?? videoFallback ?? videoSrc
      : videoSrc;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [effectiveScrollVh, setEffectiveScrollVh] = useState(scrollVh);

  useEffect(() => {
    const updateScrollVh = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setEffectiveScrollVh(mobile ? HERO_SCROLL_VH_MOBILE : scrollVh);
    };

    updateScrollVh();
    const media = window.matchMedia("(max-width: 768px)");
    media.addEventListener("change", updateScrollVh);
    return () => media.removeEventListener("change", updateScrollVh);
  }, [scrollVh]);

  const durationRef = useRef(10);
  const framesRef = useRef(frames);
  const layerCacheRef = useRef<CachedLayer[]>([]);
  const setupDoneRef = useRef(false);
  const lastFrameIndexRef = useRef(0);
  const scrubRafRef = useRef(0);
  const pendingProgressRef = useRef(0);
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  framesRef.current = frames;

  useEffect(() => {
    if (!scrollReady) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage) return;
    if (!imageSequence?.length && !video) return;

    let trigger: ScrollTrigger | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;

    const videoState = {
      targetTime: 0,
      seeking: false,
      queued: false,
      lastPainted: -1,
    };

    const syncLayerCache = () => {
      if (contentRef.current) {
        layerCacheRef.current = buildLayerCache(contentRef.current);
      }
    };

    const paintVideoFrame = () => {
      if (!video || !canvas || video.readyState < 2 || video.seeking) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;

      const cw = Math.round(w * dpr);
      const ch = Math.round(h * dpr);
      const size = canvasSizeRef.current;
      if (size.w !== cw || size.h !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        canvasSizeRef.current = { w: cw, h: ch };
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const scale = Math.max(w / vw, h / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
      videoState.lastPainted = video.currentTime;
    };

    const runSeek = () => {
      if (!video || imageSequence?.length || video.readyState < 2) return;

      const duration = durationRef.current;
      const quantized = quantizeVideoTime(videoState.targetTime, duration);

      if (Math.abs(quantized - videoState.lastPainted) < VIDEO_FRAME_STEP * 0.4) {
        return;
      }

      if (videoState.seeking) {
        videoState.queued = true;
        return;
      }

      if (Math.abs(video.currentTime - quantized) < 0.001) {
        paintVideoFrame();
        return;
      }

      videoState.seeking = true;
      video.currentTime = quantized;
    };

    const onSeeked = () => {
      if (!video) return;
      videoState.seeking = false;
      paintVideoFrame();

      if (videoState.queued) {
        videoState.queued = false;
        runSeek();
      }
    };

    const applyProgress = (p: number) => {
      const duration = durationRef.current;
      videoState.targetTime = Math.min(
        Math.max(p * duration, 0),
        Math.max(duration - 0.016, 0)
      );

      if (!imageSequence?.length) {
        runSeek();
      }

      const idx = updateCinematicLayers(layerCacheRef.current, framesRef.current, p);

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scale3d(${p}, 1, 1)`;
      }

      if (idx !== lastFrameIndexRef.current) {
        lastFrameIndexRef.current = idx;
        const chapter = framesRef.current[idx]?.chapter ?? "01";
        if (progressLabelRef.current) progressLabelRef.current.textContent = chapter;
        railRef.current?.querySelectorAll(".hero-cinematic__rail-item").forEach((item, i) => {
          item.classList.toggle("is-active", i === idx);
        });
      }

      if (scrollHintRef.current) {
        const show = idx === 0 && p < 0.06;
        scrollHintRef.current.style.opacity = show ? "1" : "0";
        scrollHintRef.current.style.visibility = show ? "visible" : "hidden";
      }

      if (imageSequence?.length && mediaFrameRef.current) {
        const slideIndex = Math.min(Math.floor(p * imageSequence.length), imageSequence.length - 1);
        mediaFrameRef.current
          .querySelectorAll(".hero-cinematic__slide")
          .forEach((slide, i) => slide.classList.toggle("is-active", i === slideIndex));
      }

      if (!fullscreen && mediaFrameRef.current) {
        const { margin, borderRadius } = containerTransform(p);
        mediaFrameRef.current.style.margin = margin;
        mediaFrameRef.current.style.borderRadius = borderRadius;
        stageRef.current?.style.setProperty("--hero-frame-inset", `${parseFloat(margin) || 0}px`);
      }
    };

    const scheduleScrub = (p: number) => {
      pendingProgressRef.current = p;
      if (scrubRafRef.current) return;
      scrubRafRef.current = requestAnimationFrame(() => {
        scrubRafRef.current = 0;
        applyProgress(pendingProgressRef.current);
      });
    };

    const setup = () => {
      if (disposed || setupDoneRef.current) return;
      setupDoneRef.current = true;

      if (video?.duration && !Number.isNaN(video.duration)) {
        durationRef.current = video.duration;
      } else if (imageSequence?.length) {
        durationRef.current = imageSequence.length;
      }

      video?.pause();
      if (video) {
        video.currentTime = 0;
        videoState.targetTime = 0;
        videoState.lastPainted = -1;
      }

      syncLayerCache();

      ScrollTrigger.getById(`hero-cinematic-${id}`)?.kill();
      trigger = ScrollTrigger.create({
        id: `hero-cinematic-${id}`,
        trigger: section,
        start: `top top+=${getNavOffset()}`,
        end: "bottom bottom",
        pin: stage,
        pinSpacing: true,
        scrub: 0.08,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        scroller: document.documentElement,
        onUpdate: (self) => scheduleScrub(self.progress),
      });

      scheduleScrub(trigger.progress || 0);
      if (video) runSeek();
    };

    const onReady = () => {
      setVideoReady(true);
      setup();
    };

    const onVideoError = () => {
      if (!video || !videoFallback) return;
      if (video.src.includes(videoFallback)) return;
      setupDoneRef.current = false;
      video.src = videoFallback;
      video.load();
      video.addEventListener("loadedmetadata", onReady, { once: true });
    };

    setupDoneRef.current = false;
    syncLayerCache();

    if (imageSequence?.length) {
      setVideoReady(true);
      setup();
    } else if (video) {
      video.addEventListener("loadedmetadata", onReady, { once: true });
      video.addEventListener("seeked", onSeeked);
      video.addEventListener("error", onVideoError);
      if (video.readyState >= 2) onReady();
    }

    const hasVideo = Boolean(activeVideoSrc) && !imageSequence?.length;
    let resizeRaf = 0;
    resizeObserver = new ResizeObserver(() => {
      if (!hasVideo || !canvas) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (!videoState.seeking) paintVideoFrame();
      });
    });
    if (canvas && hasVideo) resizeObserver.observe(canvas);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        syncLayerCache();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      setupDoneRef.current = false;
      clearTimeout(resizeTimer);
      cancelAnimationFrame(resizeRaf);
      if (scrubRafRef.current) cancelAnimationFrame(scrubRafRef.current);
      scrubRafRef.current = 0;
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
      video?.removeEventListener("seeked", onSeeked);
      video?.removeEventListener("error", onVideoError);
      trigger?.kill();
    };
  }, [scrollReady, id, imageSequence, videoFallback, videoSrc, videoSrcLight, activeVideoSrc, fullscreen, effectiveScrollVh]);

  useEffect(() => {
    if (!markHeroActive) return;
    document.documentElement.setAttribute("data-hero-active", "true");
    return () => document.documentElement.removeAttribute("data-hero-active");
  }, [markHeroActive]);

  /* Show opening frame before ScrollTrigger initializes */
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const first = root.querySelector<HTMLElement>('[data-frame-index="0"]');
    if (!first) return;
    first.style.opacity = "1";
    first.style.visibility = "visible";
    first.style.pointerEvents = "auto";
    first.style.zIndex = "3";
  }, []);

  const useVideo = Boolean(activeVideoSrc) && !imageSequence?.length;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideoSrc || imageSequence?.length) return;
    if (video.src.includes(activeVideoSrc)) return;
    setVideoReady(false);
    video.src = activeVideoSrc;
    video.load();
  }, [activeVideoSrc, imageSequence]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("hero-cinematic", fullscreen && "hero-cinematic--fullscreen")}
      style={{ height: `${effectiveScrollVh}vh` }}
    >
      <div ref={stageRef} className="hero-cinematic__stage">
        <div
          ref={mediaFrameRef}
          className={cn("hero-cinematic__frame", fullscreen && "hero-cinematic__frame--fullscreen")}
        >
          <div className="hero-cinematic__media">
            {imageSequence?.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="hero-cinematic__slide"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
            {useVideo && (
              <video
                ref={videoRef}
                className="hero-cinematic__video-source"
                src={activeVideoSrc}
                poster={posterSrc}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
              />
            )}
            <canvas
              ref={canvasRef}
              className={`hero-cinematic__canvas ${videoReady && useVideo ? "is-ready" : ""}`}
              aria-hidden
            />
            {!videoReady && !imageSequence?.length && (
              <div
                className="hero-cinematic__poster"
                style={{ backgroundImage: `url(${posterSrc})` }}
              />
            )}
            <div className="hero-cinematic__readability" />
            <div className="hero-cinematic__vignette" />
          </div>
        </div>

        <div ref={contentRef} className="hero-cinematic__content">
          {frames.map((frame, i) => (
            <FrameLayer key={frame.id} frame={frame} index={i} />
          ))}
        </div>

        <nav ref={railRef} className="hero-cinematic__rail" aria-label="Kapitel">
          {frames.map((frame, i) => (
            <span
              key={frame.id}
              className={`hero-cinematic__rail-item ${i === 0 ? "is-active" : ""}`}
            >
              {frame.chapter}
            </span>
          ))}
        </nav>

        <div className="hero-cinematic__progress" aria-hidden>
          <span ref={progressLabelRef} className="hero-cinematic__progress-label">
            {frames[0]?.chapter ?? "01"}
          </span>
          <div className="hero-cinematic__progress-track">
            <div ref={progressFillRef} className="hero-cinematic__progress-fill" />
          </div>
        </div>

        <div ref={scrollHintRef} className="hero-cinematic__scroll-hint" aria-hidden>
          <div className="hero-cinematic__scroll-indicator">
            <span className="hero-cinematic__scroll-line" />
            <span className="hero-cinematic__scroll-arrow" aria-hidden>
              ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}
