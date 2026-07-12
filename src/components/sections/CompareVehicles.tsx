"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatPrice } from "@/lib/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GitCompare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CompareVehicles() {
  const ref = useRef<HTMLElement>(null);
  const compareProducts = products.slice(0, 3);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".compare-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding py-32 md:py-48">
      <SectionHeading
        label="Compare"
        title="Find Your Match"
        description="Three vehicles. One perfect fit."
        className="mb-16"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {compareProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="compare-card group relative overflow-hidden rounded-2xl border border-border bg-card"
            data-cursor="pointer"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-medium">{product.name}</h3>
              <p className="mt-1 text-sm text-foreground-secondary">
                {product.specs.range} · {product.specs.power}
              </p>
              <p className="mt-3 font-medium">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm transition-colors hover:bg-card"
          data-cursor="pointer"
        >
          <GitCompare className="h-4 w-4" />
          Compare all vehicles
        </Link>
      </div>
    </section>
  );
}
