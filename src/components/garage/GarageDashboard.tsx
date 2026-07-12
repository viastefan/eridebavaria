"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Car,
  Sparkles,
  Wrench,
  FileText,
  Shield,
  Battery,
  Calendar,
  LogOut,
} from "lucide-react";
import { platform } from "@/lib/platform";
import { getProductBySlug, formatPrice } from "@/lib/products";
import type { GarageAccessData } from "@/lib/garage-types";

const VehicleScene = dynamic(
  () => import("@/components/hero/VehicleScene").then((m) => m.VehicleScene),
  { ssr: false, loading: () => <div className="h-full bg-card" /> }
);

const garageTabs = [
  { id: "vehicle", label: platform.garage.tabs.vehicle, icon: Car },
  { id: "upgrades", label: platform.garage.tabs.upgrades, icon: Sparkles },
  { id: "service", label: platform.garage.tabs.service, icon: Wrench },
  { id: "documents", label: platform.garage.tabs.documents, icon: FileText },
  { id: "warranty", label: platform.garage.tabs.warranty, icon: Shield },
] as const;

function formatGermanDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

interface GarageDashboardProps {
  access: GarageAccessData;
  onLogout: () => void;
}

export function GarageDashboard({ access, onLogout }: GarageDashboardProps) {
  const [tab, setTab] = useState<(typeof garageTabs)[number]["id"]>("vehicle");
  const [loggingOut, setLoggingOut] = useState(false);
  const product = getProductBySlug(access.productSlug);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/garage/logout", { method: "POST" });
      onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-accent">
              Digital Garage
            </span>
            <h1 className="heading-xl mt-4">{platform.garage.title}</h1>
            <p className="mt-3 text-foreground-secondary">
              {access.customerName
                ? `Willkommen, ${access.customerName} — ${access.productName}`
                : platform.garage.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="garage-dashboard__logout"
          >
            <LogOut className="h-3.5 w-3.5" />
            Abmelden
          </button>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto hide-scrollbar lg:flex-col lg:gap-1">
            {garageTabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-500 ${
                    tab === t.id
                      ? "bg-card-elevated text-foreground"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className="min-h-[480px] rounded-3xl border border-border bg-card p-8 md:p-10">
            {tab === "vehicle" && (
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-background">
                  <VehicleScene />
                </div>
                <div>
                  <h2 className="text-2xl font-medium">{access.productName}</h2>
                  <p className="mt-2 text-foreground-secondary">
                    {product?.tagline ?? "Ihr registriertes Fahrzeug"}
                  </p>
                  {access.vin && (
                    <p className="mt-4 text-xs tracking-wide text-foreground-secondary">
                      VIN · {access.vin}
                    </p>
                  )}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border p-4">
                      <Battery className="h-4 w-4 text-accent" />
                      <p className="mt-2 text-xs text-foreground-secondary">
                        {platform.garage.batteryHealth}
                      </p>
                      <p className="mt-1 text-lg font-medium">{access.batteryHealth}%</p>
                    </div>
                    <div className="rounded-xl border border-border p-4">
                      <Calendar className="h-4 w-4 text-accent" />
                      <p className="mt-2 text-xs text-foreground-secondary">
                        {platform.garage.nextService}
                      </p>
                      <p className="mt-1 text-lg font-medium">
                        {formatGermanDate(access.nextServiceDate)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/product/${access.productSlug}`}
                    className="mt-8 inline-block text-sm text-accent hover:underline"
                  >
                    Showroom öffnen →
                  </Link>
                </div>
              </div>
            )}

            {tab === "upgrades" && (
              <div>
                <h2 className="text-xl font-medium">Empfohlene Upgrades</h2>
                <div className="mt-6 space-y-4">
                  {["Winterpaket", "Dachbox", "LED-Bar"].map((u) => (
                    <Link
                      key={u}
                      href="/upgrades"
                      className="flex items-center justify-between rounded-xl border border-border p-5 transition-colors hover:bg-card-elevated"
                    >
                      <span>{u}</span>
                      <span className="text-sm text-foreground-secondary">Entdecken →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tab === "service" && (
              <div>
                <h2 className="text-xl font-medium">{platform.garage.timeline}</h2>
                <div className="mt-8 space-y-6">
                  {access.serviceLog.map((item) => (
                    <div
                      key={`${item.date}-${item.event}`}
                      className="flex gap-6 border-l border-border pl-6"
                    >
                      <span className="text-xs text-foreground-secondary">{item.date}</span>
                      <p className="text-sm">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "documents" && (
              <div className="space-y-3">
                {access.documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-xl border border-border p-5"
                  >
                    <span className="text-sm">{doc.name}</span>
                    <span className="text-xs text-accent">{doc.type}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "warranty" && (
              <div>
                <h2 className="text-xl font-medium">2 Jahre Vollgarantie</h2>
                <p className="mt-4 text-foreground-secondary">
                  Gültig bis {formatGermanDate(access.warrantyUntil)}. Alle Komponenten abgedeckt.
                </p>
                {product && (
                  <p className="mt-8 text-sm text-foreground-secondary">
                    Fahrzeugwert: {formatPrice(product.price)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
