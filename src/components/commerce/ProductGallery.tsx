"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { labels } from "@/lib/labels";
import type { Product } from "@/lib/types";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-card"
          onMouseMove={handleMouseMove}
          onClick={() => setFullscreen(true)}
          data-cursor="pointer"
        >
          <motion.div
            className="relative h-full w-full"
            animate={{
              scale: 1.05,
              x: (mousePos.x - 0.5) * -20,
              y: (mousePos.y - 0.5) * -20,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          >
            <Image
              src={product.images[activeIndex]}
              alt={product.name}
              fill
              className="object-contain p-4 md:p-8"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </motion.div>
          <div className="absolute right-4 bottom-4 rounded-full bg-background/60 px-3 py-1.5 text-xs backdrop-blur-xl">
            {labels.view360}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
                i === activeIndex
                  ? "ring-2 ring-accent"
                  : "opacity-50 hover:opacity-100"
              }`}
              data-cursor="pointer"
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 z-10 rounded-full bg-card p-3"
              data-cursor="pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + product.images.length) % product.images.length)}
              className="absolute left-6 z-10 rounded-full bg-card p-3"
              data-cursor="pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % product.images.length)}
              className="absolute right-6 z-10 rounded-full bg-card p-3"
              data-cursor="pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="relative h-[80vh] w-[90vw]">
              <Image
                src={product.images[activeIndex]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
