"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useSpring, useTransform } from "framer-motion";

interface Vehicle360PreviewProps {
  images: string[];
  alt: string;
  className?: string;
  priority?: boolean;
}

export function Vehicle360Preview({
  images,
  alt,
  className = "",
  priority = false,
}: Vehicle360PreviewProps) {
  const frames = images.length > 0 ? images : ["/media/veo-hero-poster.png"];
  const [frameIndex, setFrameIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<number | null>(null);
  const mouseXRef = useRef(0.5);

  const springX = useSpring(0, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(springX, [-1, 1], [-8, 8]);
  const scale = useTransform(springX, [-1, 0, 1], [1.04, 1.08, 1.04]);

  const updateFrame = useCallback(() => {
    const x = mouseXRef.current;
    const index = Math.round(x * (frames.length - 1));
    setFrameIndex(Math.max(0, Math.min(frames.length - 1, index)));
  }, [frames.length]);

  const startAutoRotate = useCallback(() => {
    if (frames.length <= 1) return;
    let t = 0;
    const tick = () => {
      t += 0.004;
      mouseXRef.current = (Math.sin(t) + 1) / 2;
      updateFrame();
      autoRotateRef.current = requestAnimationFrame(tick);
    };
    autoRotateRef.current = requestAnimationFrame(tick);
  }, [frames.length, updateFrame]);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateRef.current) {
      cancelAnimationFrame(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    mouseXRef.current = x;
    springX.set((x - 0.5) * 2);
    stopAutoRotate();
    updateFrame();
  };

  const handleMouseEnter = () => {
    setHovering(true);
    startAutoRotate();
  };

  const handleMouseLeave = () => {
    setHovering(false);
    stopAutoRotate();
    mouseXRef.current = 0.5;
    springX.set(0);
    setFrameIndex(0);
  };

  useEffect(() => () => stopAutoRotate(), [stopAutoRotate]);

  return (
    <div
      ref={containerRef}
      className={`vehicle-360 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`vehicle-360__glow ${hovering ? "vehicle-360__glow--active" : ""}`} />
      <motion.div
        className="vehicle-360__stage"
        style={{ rotateY, scale }}
      >
        <Image
          src={frames[frameIndex]}
          alt={alt}
          fill
          className="vehicle-360__image"
          sizes="(max-width: 768px) 90vw, 45vw"
          priority={priority}
        />
      </motion.div>
      {frames.length > 1 && (
        <span className={`vehicle-360__hint ${hovering ? "vehicle-360__hint--visible" : ""}`}>
          360°
        </span>
      )}
    </div>
  );
}
