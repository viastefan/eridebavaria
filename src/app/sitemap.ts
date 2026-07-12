import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { journalArticles } from "@/lib/platform";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eridebavaria.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/shop", "/compare", "/checkout", "/garage", "/fleet", "/upgrades", "/journal"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const journalRoutes = journalArticles.map((a) => ({
    url: `${baseUrl}/journal/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...journalRoutes];
}
