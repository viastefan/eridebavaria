"use client";

import Link from "next/link";

const shopSections = [
  { id: "vehicles" as const, label: "Fahrzeuge" },
  { id: "accessories" as const, label: "Zubehör" },
  { id: "parts" as const, label: "Ersatzteile", href: "/parts" },
  { id: "fleet" as const, label: "Flotten & Gewerbe", href: "/fleet" },
  { id: "service" as const, label: "Service", href: "/service" },
];

interface ShopCategoryNavProps {
  activeTab: "vehicles" | "accessories";
  onTabChange: (tab: "vehicles" | "accessories") => void;
}

export function ShopCategoryNav({ activeTab, onTabChange }: ShopCategoryNavProps) {
  return (
    <nav className="shop-category-nav" aria-label="Shop-Kategorien">
      <div className="shop-category-nav__track">
        {shopSections.map((item) => {
          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="shop-category-nav__item">
                {item.label}
              </Link>
            );
          }
          const active = activeTab === item.id;
          if (item.id !== "vehicles" && item.id !== "accessories") return null;
          return (
            <button
              key={item.id}
              type="button"
              className={`shop-category-nav__item ${active ? "shop-category-nav__item--active" : ""}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
