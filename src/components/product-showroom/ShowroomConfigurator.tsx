"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ConfigOption } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";
import { Button } from "@/components/ui/Button";

function OptionRow({
  label,
  options,
  value,
  onChange,
  type = "default",
}: {
  label: string;
  options: ConfigOption[];
  value: string;
  onChange: (id: string) => void;
  type?: "color" | "default";
}) {
  if (options.length <= 1 && options[0]?.name === "—") return null;

  return (
    <div className="border-b border-border py-6 last:border-0">
      <h4 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-foreground-secondary">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-4 py-2.5 text-sm transition-all duration-700 ${
              value === opt.id
                ? "bg-foreground text-background"
                : "border border-border text-foreground-secondary hover:border-foreground/20 hover:text-foreground"
            }`}
            data-cursor="pointer"
          >
            {type === "color" && opt.hex && (
              <span
                className="mr-2 inline-block h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: opt.hex }}
              />
            )}
            {opt.name}
            {opt.price ? ` +${formatPrice(opt.price)}` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShowroomConfigurator() {
  const { product, config, updateConfig, specs, saveCurrentConfig, saveStatus, data } =
    useShowroom();
  const { addToCart } = useStore();
  const [open, setOpen] = useState(true);
  const cfg = product.configurator;
  const ext = data.extendedOptions;

  const configRecord = Object.fromEntries(
    Object.entries(config).filter(([k]) => k !== "accessories").map(([k, v]) => [k, String(v)])
  );

  const addConfiguredToCart = (requestOffer = false) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: specs.price,
      image: product.images[0],
      configuration: configRecord,
      requestOffer,
    });
  };

  const extOptions = (opts: ConfigOption[], key: keyof typeof config) => (
    <OptionRow
      label={showroomLabels.configGroups[key as keyof typeof showroomLabels.configGroups] ?? key}
      options={opts}
      value={config[key] as string}
      onChange={(id) => updateConfig({ [key]: id })}
    />
  );

  return (
    <section id="configure" className="section-padding border-t border-border py-24 md:py-32">
      <div className="mb-16 flex items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
            {showroomLabels.configure}
          </span>
          <h2 className="heading-xl mt-4">{showroomLabels.configuration}</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-foreground-secondary transition-colors hover:text-foreground"
        >
          {open ? "Einklappen" : "Öffnen"}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-12 lg:grid-cols-[1fr_360px]"
        >
          <div className="rounded-3xl border border-border bg-card/40 p-8 md:p-12">
            <OptionRow
              label={showroomLabels.configGroups.color}
              options={cfg.colors}
              value={config.color}
              onChange={(id) => updateConfig({ color: id })}
              type="color"
            />
            <OptionRow
              label={showroomLabels.configGroups.wheels}
              options={cfg.wheels}
              value={config.wheels}
              onChange={(id) => updateConfig({ wheels: id })}
            />
            {extOptions(ext.tyres, "tyres")}
            <OptionRow
              label={showroomLabels.configGroups.battery}
              options={cfg.battery}
              value={config.battery}
              onChange={(id) => updateConfig({ battery: id })}
            />
            <OptionRow
              label={showroomLabels.configGroups.roof}
              options={cfg.roof}
              value={config.roof}
              onChange={(id) => updateConfig({ roof: id })}
            />
            <OptionRow
              label={showroomLabels.configGroups.cargoBox}
              options={cfg.cargoBox}
              value={config.cargoBox}
              onChange={(id) => updateConfig({ cargoBox: id })}
            />
            {extOptions(ext.seats, "seats")}
            {extOptions(ext.lighting, "lighting")}
            {extOptions(ext.doors, "doors")}
            {extOptions(ext.windows, "windows")}
            {extOptions(ext.performance, "performance")}
            {extOptions(ext.towHook, "towHook")}
            {extOptions(ext.storage, "storage")}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border bg-card/60 p-8 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-foreground-secondary">
                {showroomLabels.configuredPrice}
              </p>
              <p className="mt-3 text-4xl font-medium tracking-tight">
                {formatPrice(specs.price)}
              </p>
              <div className="mt-8 space-y-4 border-t border-border pt-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">{showroomLabels.range}</span>
                  <span>{specs.rangeKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">{showroomLabels.weight}</span>
                  <span>{specs.weightKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">{showroomLabels.payload}</span>
                  <span>{specs.payloadKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">{showroomLabels.delivery}</span>
                  <span>
                    {specs.deliveryWeeks} {showroomLabels.weeks}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => saveCurrentConfig()}
                className="mt-8 w-full rounded-full border border-border py-3.5 text-sm transition-all duration-700 hover:bg-foreground hover:text-background"
                data-cursor="pointer"
              >
                {saveStatus === "saving"
                  ? "Wird gespeichert …"
                  : saveStatus === "saved"
                    ? "Konfiguration gespeichert"
                    : saveStatus === "error"
                      ? "Speichern fehlgeschlagen"
                      : showroomLabels.saveConfig}
              </button>
              <Button
                onClick={() => addConfiguredToCart(false)}
                className="mt-3 w-full"
              >
                In den Warenkorb
              </Button>
              <button
                type="button"
                onClick={() => addConfiguredToCart(true)}
                className="mt-3 w-full rounded-full border border-accent py-3.5 text-sm text-accent transition-colors hover:bg-accent/10"
                data-cursor="pointer"
              >
                Individuelles Angebot anfragen
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
