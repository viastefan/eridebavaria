import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { products, accessoryCatalog } from "../src/lib/products";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { id: "kleinwagen", slug: "elektro-kleinwagen", name: "Elektro Kleinwagen", sortOrder: 1 },
  { id: "transporter", slug: "elektro-transporter", name: "Elektro-Transporter", sortOrder: 2 },
  { id: "quads", slug: "quads", name: "Quads", sortOrder: 3 },
  { id: "motorraeder", slug: "motorraeder", name: "Motorräder", sortOrder: 4 },
  { id: "mopedauto", slug: "mopedauto", name: "Mopedauto 45 km/h", sortOrder: 5 },
  { id: "utv", slug: "utv", name: "UTVs", sortOrder: 6 },
  { id: "roller", slug: "roller", name: "Roller & Moped", sortOrder: 7 },
  { id: "zubehoer", slug: "zubehoer", name: "Zubehör", sortOrder: 8 },
  { id: "ersatzteile", slug: "ersatzteile", name: "Ersatzteile", sortOrder: 9 },
];

const configOptionKeys = [
  { name: "Color", key: "colors" },
  { name: "Wheels", key: "wheels" },
  { name: "Battery", key: "battery" },
  { name: "Roof", key: "roof" },
  { name: "Cargo", key: "cargoBox" },
] as const;

async function seedCategories() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
}

async function seedProducts() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        status: "ACTIVE",
        available: true,
        featured: p.id === "efo-em8",
      },
      create: {
        id: p.id,
        slug: p.slug,
        sku: p.id.toUpperCase(),
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        brand: p.brand,
        categoryId: p.categoryId,
        productType: "VEHICLE",
        status: "ACTIVE",
        available: true,
        badge: p.badge ?? null,
        availability: "IN_STOCK",
        images: JSON.stringify(p.images),
        specs: JSON.stringify(p.specs),
        story: JSON.stringify(p.story),
        configurator: JSON.stringify(p.configurator),
        relatedIds: JSON.stringify(p.relatedAccessoryIds),
        featured: p.id === "efo-em8",
      },
    });

    for (let i = 0; i < configOptionKeys.length; i++) {
      const opt = configOptionKeys[i];
      const values = p.configurator[opt.key];
      if (!values?.length) continue;

      const optionId = `${p.id}-${opt.key}`;
      await prisma.productConfigOption.upsert({
        where: { id: optionId },
        update: {
          availableValues: JSON.stringify(values),
          sortOrder: i,
        },
        create: {
          id: optionId,
          productId: p.id,
          optionName: opt.name,
          optionType: opt.key === "colors" ? "color" : "select",
          availableValues: JSON.stringify(values),
          sortOrder: i,
        },
      });
    }
  }

  for (const a of accessoryCatalog) {
    await prisma.product.upsert({
      where: { id: a.id },
      update: { name: a.name, price: a.price, status: "ACTIVE" },
      create: {
        id: a.id,
        slug: a.slug,
        sku: a.id.toUpperCase(),
        name: a.name,
        tagline: a.name,
        description: a.description,
        price: a.price,
        brand: "eRide Bavaria",
        categoryId: "zubehoer",
        productType: "ACCESSORY",
        status: "ACTIVE",
        available: true,
        images: JSON.stringify([a.image]),
        specs: JSON.stringify({}),
      },
    });
  }
}

async function seedSpareParts() {
  const parts = [
    {
      partNumber: "EB-BAT-72V-117",
      name: "Akku 72V 117Ah",
      compatibility: JSON.stringify(["efo-em8", "eec-amy-35"]),
      price: 1890,
      productId: "efo-em8",
      images: JSON.stringify(["https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg"]),
    },
    {
      partNumber: "EB-BRAKE-FRONT",
      name: "Vorderbremsbelag Set",
      compatibility: JSON.stringify(["efo-em8", "efo-ev3000", "ego-ek4"]),
      price: 49,
      images: JSON.stringify(["https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg"]),
    },
    {
      partNumber: "EB-TIRE-14",
      name: "Reifen 14\" Allwetter",
      compatibility: JSON.stringify(["ego-ek4", "e-truck-45"]),
      price: 89,
      productId: "ego-ek4",
      images: JSON.stringify(["https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg"]),
    },
    {
      partNumber: "EB-CHARGER-60V",
      name: "Ladegerät 60V Ersatz",
      compatibility: JSON.stringify(["ego-ek4", "e-truck-45", "efo-ev3000"]),
      price: 199,
      images: JSON.stringify(["https://ebuddys.at/wp-content/uploads/2024/11/Gecotiroblau.jpg"]),
    },
  ];

  for (const part of parts) {
    await prisma.sparePart.upsert({
      where: { partNumber: part.partNumber },
      update: part,
      create: part,
    });
  }
}

async function seedUsers() {
  const adminHash = await bcrypt.hash("admin1234", 12);
  const employeeHash = await bcrypt.hash("employee1234", 12);

  await prisma.user.upsert({
    where: { email: "admin@eridebavaria.de" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: "admin@eridebavaria.de",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "eRide",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "sales@eridebavaria.de" },
    update: { passwordHash: employeeHash, role: "EMPLOYEE" },
    create: {
      email: "sales@eridebavaria.de",
      passwordHash: employeeHash,
      firstName: "Sales",
      lastName: "Team",
      role: "EMPLOYEE",
    },
  });
}

async function seedGarage() {
  const demoPin = "EB739204";
  const pinHash = await bcrypt.hash(demoPin, 12);

  const serviceLog = JSON.stringify([
    { date: "März 2026", event: "Inspektion abgeschlossen", type: "service" },
    { date: "Jan 2026", event: "Winterpaket montiert", type: "upgrade" },
    { date: "Dez 2025", event: "Fahrzeug übergeben", type: "delivery" },
  ]);

  const documents = JSON.stringify([
    { name: "Fahrzeugschein", type: "PDF" },
    { name: "Garantieurkunde", type: "PDF" },
    { name: "Bedienungsanleitung", type: "PDF" },
    { name: "Rechnung", type: "PDF" },
  ]);

  await prisma.garageAccess.upsert({
    where: { id: "demo-garage-eec-star" },
    update: { pinHash, active: true },
    create: {
      id: "demo-garage-eec-star",
      pinHash,
      productId: "eec-star-60",
      productSlug: "eec-star-60",
      productName: "EEC Star 6.0",
      customerName: "Demo Kunde",
      vin: "EB-SIM-2025-0042",
      purchaseDate: new Date("2025-12-15"),
      warrantyUntil: new Date("2028-03-15"),
      batteryHealth: 94,
      nextServiceDate: new Date("2026-06-15"),
      serviceLog,
      documents,
    },
  });
}

async function main() {
  console.log("Seeding database…");
  await seedCategories();
  await seedProducts();
  await seedSpareParts();
  await seedUsers();
  await seedGarage();
  console.log("Seed complete.");
  console.log("Admin: admin@eridebavaria.de / admin1234");
  console.log("Sales: sales@eridebavaria.de / employee1234");
  console.log("Garage PIN: EB-739-204");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
