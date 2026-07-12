"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import {
  vehicleCategoryGroups,
  type VehicleCategoryGroup,
  getProductCategoryGroup,
} from "@/lib/showroom-filters";

interface CompatibilityFinderProps {
  products: Product[];
  activeCategories: VehicleCategoryGroup[];
  onCategoryToggle: (id: VehicleCategoryGroup) => void;
}

export function CompatibilityFinder({
  products,
  activeCategories,
  onCategoryToggle,
}: CompatibilityFinderProps) {
  const representatives = vehicleCategoryGroups.map((group) => {
    const match = products.find((p) => getProductCategoryGroup(p) === group.id);
    return { ...group, image: match?.images[0] ?? null };
  });

  return (
    <section className="compatibility-finder" aria-labelledby="compatibility-title">
      <div className="compatibility-finder__header">
        <div className="compatibility-finder__copy">
          <h2 id="compatibility-title" className="compatibility-finder__title">
            Kompatibilität prüfen
          </h2>
          <p className="compatibility-finder__subtitle">
            Suchen Sie nach einem passenden Fahrzeug für Ihren Einsatz?
          </p>
        </div>
        <div className="compatibility-finder__actions">
          <Link href="/fleet" className="compatibility-finder__pill">
            Mit Anforderungen
          </Link>
          <Link href="/garage" className="compatibility-finder__pill compatibility-finder__pill--muted">
            Meine Fahrzeuge
          </Link>
        </div>
      </div>

      <div className="compatibility-finder__grid">
        {representatives.map((group, i) => {
          const active = activeCategories.includes(group.id);
          return (
            <motion.button
              key={group.id}
              type="button"
              className={`compatibility-finder__card ${active ? "compatibility-finder__card--active" : ""}`}
              onClick={() => onCategoryToggle(group.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="compatibility-finder__card-bg" aria-hidden />
              <div className="compatibility-finder__visual">
                {group.image ? (
                  <Image
                    src={group.image}
                    alt=""
                    fill
                    className="compatibility-finder__image"
                    sizes="(max-width: 768px) 44vw, 10vw"
                  />
                ) : (
                  <div className="compatibility-finder__placeholder" />
                )}
              </div>
              <span className="compatibility-finder__label">{group.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
