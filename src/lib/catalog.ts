import { prisma } from "./db";
import {
  products as staticProducts,
  accessoryCatalog as staticAccessories,
  featuredProductId as staticFeaturedId,
} from "./products";
import type { Product, Accessory, ProductConfigurator } from "./types";

type DbProduct = Awaited<ReturnType<typeof fetchDbProduct>>;

async function fetchDbProduct(where: { slug?: string; id?: string }) {
  try {
    return await prisma.product.findFirst({
      where: {
        ...where,
        status: "ACTIVE",
        available: true,
      },
      include: { category: true, configOptions: { orderBy: { sortOrder: "asc" } } },
    });
  } catch {
    return null;
  }
}

function mapAvailability(av: string): Product["availability"] {
  const map: Record<string, Product["availability"]> = {
    IN_STOCK: "in-stock",
    PRE_ORDER: "pre-order",
    SOLD_OUT: "sold-out",
    LOW_STOCK: "in-stock",
  };
  return map[av] ?? "in-stock";
}

function buildConfigurator(
  configJson: string | null,
  options: { optionName: string; availableValues: string }[]
): ProductConfigurator {
  if (configJson) {
    try {
      return JSON.parse(configJson) as ProductConfigurator;
    } catch {
      /* fall through */
    }
  }

  const config: ProductConfigurator = {
    colors: [],
    wheels: [],
    battery: [],
    roof: [],
    cargoBox: [],
  };

  for (const opt of options) {
    try {
      const values = JSON.parse(opt.availableValues);
      const key = opt.optionName.toLowerCase();
      if (key.includes("color") || key.includes("farbe")) config.colors = values;
      else if (key.includes("wheel") || key.includes("rad")) config.wheels = values;
      else if (key.includes("batter")) config.battery = values;
      else if (key.includes("roof") || key.includes("dach")) config.roof = values;
      else if (key.includes("cargo") || key.includes("laderaum")) config.cargoBox = values;
    } catch {
      /* skip */
    }
  }

  return config;
}

function mapDbToProduct(p: NonNullable<DbProduct>): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    price: p.price,
    category: p.category.name,
    categoryId: p.categoryId,
    badge: p.badge as Product["badge"],
    availability: mapAvailability(p.availability),
    brand: p.brand,
    images: JSON.parse(p.images) as string[],
    specs: JSON.parse(p.specs),
    story: p.story ? JSON.parse(p.story) : [],
    configurator: buildConfigurator(p.configurator, p.configOptions),
    relatedAccessoryIds: JSON.parse(p.relatedIds) as string[],
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE", available: true, productType: "VEHICLE" },
      include: { category: true, configOptions: { orderBy: { sortOrder: "asc" } } },
      orderBy: { featured: "desc" },
    });
    if (rows.length > 0) return rows.map(mapDbToProduct);
  } catch {
    /* fall back to static catalog for Vercel / empty DB */
  }
  return staticProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await fetchDbProduct({ slug });
  if (row) return mapDbToProduct(row);
  return staticProducts.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await fetchDbProduct({ id });
  if (row) return mapDbToProduct(row);
  return staticProducts.find((p) => p.id === id) ?? null;
}

export async function getAllAccessories(): Promise<Accessory[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { status: "ACTIVE", available: true, productType: "ACCESSORY" },
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: (JSON.parse(p.images) as string[])[0] ?? "",
        description: p.description,
      }));
    }
  } catch {
    /* fall back */
  }
  return staticAccessories;
}

export async function getFeaturedProductId(): Promise<string | null> {
  try {
    const featured = await prisma.product.findFirst({
      where: { featured: true, status: "ACTIVE" },
      select: { id: true },
    });
    if (featured?.id) return featured.id;
  } catch {
    /* fall back */
  }
  return staticFeaturedId;
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function getSpareParts(productId?: string) {
  try {
    return await prisma.sparePart.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export async function searchCatalog(query: string) {
  const empty = {
    products: [] as { id: string; type: "product"; name: string; subtitle: string; image: string; href: string }[],
    parts: [] as { id: string; type: "part"; name: string; subtitle: string; image: string; href: string }[],
    customers: [] as { id: string; type: "customer"; name: string; subtitle: string; href: string }[],
    orders: [] as { id: string; type: "order"; name: string; subtitle: string; href: string }[],
  };

  const q = query.toLowerCase();
  if (!q) return empty;

  try {
    const [products, parts, customers, orders] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { tagline: { contains: q } },
            { description: { contains: q } },
          ],
          status: "ACTIVE",
        },
        take: 8,
        include: { category: true },
      }),
      prisma.sparePart.findMany({
        where: {
          OR: [{ name: { contains: q } }, { partNumber: { contains: q } }],
        },
        take: 5,
      }),
      prisma.customer.findMany({
        where: {
          OR: [{ name: { contains: q } }, { email: { contains: q } }, { company: { contains: q } }],
        },
        take: 5,
      }),
      prisma.order.findMany({
        where: {
          OR: [{ orderNumber: { contains: q } }, { email: { contains: q } }],
        },
        take: 5,
      }),
    ]);

    return {
      products: products.map((p) => ({
        id: p.id,
        type: "product" as const,
        name: p.name,
        subtitle: p.tagline,
        image: (JSON.parse(p.images) as string[])[0] ?? "",
        href: `/product/${p.slug}`,
      })),
      parts: parts.map((p) => ({
        id: p.id,
        type: "part" as const,
        name: p.name,
        subtitle: p.partNumber,
        image: (JSON.parse(p.images) as string[])[0] ?? "",
        href: `/parts?q=${encodeURIComponent(p.partNumber)}`,
      })),
      customers: customers.map((c) => ({
        id: c.id,
        type: "customer" as const,
        name: c.name,
        subtitle: c.email,
        href: `/admin/customers?id=${c.id}`,
      })),
      orders: orders.map((o) => ({
        id: o.id,
        type: "order" as const,
        name: o.orderNumber,
        subtitle: `${o.firstName} ${o.lastName}`,
        href: `/admin/orders?id=${o.id}`,
      })),
    };
  } catch {
    const products = staticProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        type: "product" as const,
        name: p.name,
        subtitle: p.tagline,
        image: p.images[0] ?? "",
        href: `/product/${p.slug}`,
      }));

    return { ...empty, products };
  }
}
