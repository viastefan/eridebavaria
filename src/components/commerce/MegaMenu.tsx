"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { products, formatPrice } from "@/lib/products";

interface MegaLink {
  label: string;
  href: string;
  image: string;
  price?: string;
}

const megaSections: { title: string; links: MegaLink[] }[] = [
  {
    title: "Categories",
    links: categories.map((c) => ({
      label: c.title,
      href: `/shop?category=${c.id}`,
      image: c.image,
    })),
  },
  {
    title: "Featured",
    links: products.slice(0, 3).map((p) => ({
      label: p.name,
      href: `/product/${p.slug}`,
      image: p.images[0],
      price: formatPrice(p.price),
    })),
  },
  {
    title: "Discover",
    links: [
      { label: "Vehicle Finder", href: "/shop", image: products[0].images[0] },
      { label: "Compare Vehicles", href: "/compare", image: products[1].images[0] },
      { label: "Accessories", href: "/shop?category=accessories", image: categories[5].image },
      { label: "Support", href: "/support/volt-x1", image: categories[0].image },
    ],
  },
];

export function MegaMenu() {
  const { megaMenuOpen, setMegaMenuOpen } = useStore();

  return (
    <AnimatePresence>
      {megaMenuOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMegaMenuOpen(false)}
          />
          <motion.div
            className="fixed inset-x-0 top-0 z-50 max-h-[90vh] overflow-y-auto border-b border-border bg-background/95 pt-24 backdrop-blur-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-padding pb-16">
              <div className="grid gap-12 lg:grid-cols-3">
                {megaSections.map((section, si) => (
                  <div key={section.title}>
                    <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-accent">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.links.map((link, i) => (
                        <motion.div
                          key={link.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: si * 0.1 + i * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-card"
                            onClick={() => setMegaMenuOpen(false)}
                            data-cursor="pointer"
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={link.image}
                                alt={link.label}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="64px"
                              />
                            </div>
                            <div>
                              <span className="font-medium">{link.label}</span>
                              {link.price && (
                                <span className="mt-0.5 block text-sm text-foreground-secondary">
                                  {link.price}
                                </span>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border"
                    onClick={() => setMegaMenuOpen(false)}
                    data-cursor="pointer"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute right-0 bottom-0 left-0 p-4">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="mt-1 block text-xs text-foreground-secondary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
