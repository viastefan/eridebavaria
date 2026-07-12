"use client";

import "lenis/dist/lenis.css";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true,
});

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  ready: boolean;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  ready: false,
});

export function useLenis() {
  return useContext(SmoothScrollContext).lenis;
}

export function useSmoothScrollReady() {
  return useContext(SmoothScrollContext).ready;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const instance = new Lenis({
      autoRaf: false,
      lerp: isMobile ? 0.12 : 0.1,
      syncTouchLerp: isMobile ? 0.16 : 0.12,
      touchInertiaExponent: isMobile ? 1.3 : 1.4,
      smoothWheel: true,
      syncTouch: !isMobile,
      touchMultiplier: isMobile ? 0.95 : 1.05,
      wheelMultiplier: isMobile ? 1 : 0.9,
      infinite: false,
    });

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "transform",
    });

    ScrollTrigger.defaults({ scroller: root });

    instance.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        instance.resize();
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", onResize);
    setLenis(instance);
    setReady(true);
    requestAnimationFrame(() => {
      instance.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      instance.destroy();
      root.classList.remove("lenis", "lenis-smooth");
      ScrollTrigger.scrollerProxy(root, {});
      ScrollTrigger.defaults({ scroller: undefined });
      setLenis(null);
      setReady(false);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis, ready }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
