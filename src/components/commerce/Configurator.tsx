"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import type { Product, ConfigOption } from "@/lib/types";
import { formatPrice } from "@/lib/products";

interface ConfiguratorProps {
  product: Product;
  onPriceChange: (total: number, config: Record<string, string>) => void;
}

function OptionGroup({
  label,
  options,
  selected,
  onSelect,
  type = "default",
}: {
  label: string;
  options: ConfigOption[];
  selected: string;
  onSelect: (id: string) => void;
  type?: "color" | "default";
}) {
  if (options.length <= 1) return null;

  return (
    <div>
      <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground-secondary">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ${
              selected === opt.id
                ? "bg-foreground text-background"
                : "border border-border hover:border-foreground/20"
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
            {opt.range ? ` · ${opt.range}` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Configurator({ product, onPriceChange }: ConfiguratorProps) {
  const [color, setColor] = useState(product.configurator.colors[0]?.id ?? "");
  const [wheels, setWheels] = useState(product.configurator.wheels[0]?.id ?? "");
  const [battery, setBattery] = useState(product.configurator.battery[0]?.id ?? "");
  const [roof, setRoof] = useState(product.configurator.roof[0]?.id ?? "");
  const [cargoBox, setCargoBox] = useState(product.configurator.cargoBox[0]?.id ?? "");

  const totalPrice = useMemo(() => {
    const cfg = product.configurator;
    let extra = 0;
    extra += cfg.wheels.find((w) => w.id === wheels)?.price ?? 0;
    extra += cfg.battery.find((b) => b.id === battery)?.price ?? 0;
    extra += cfg.roof.find((r) => r.id === roof)?.price ?? 0;
    extra += cfg.cargoBox.find((c) => c.id === cargoBox)?.price ?? 0;
    return product.price + extra;
  }, [product, wheels, battery, roof, cargoBox]);

  useEffect(() => {
    onPriceChange(totalPrice, { color, wheels, battery, roof, cargoBox });
  }, [totalPrice, color, wheels, battery, roof, cargoBox, onPriceChange]);

  const selectedColor = product.configurator.colors.find((c) => c.id === color);

  return (
    <div className="space-y-8">
      <motion.div
        className="h-2 overflow-hidden rounded-full bg-card"
        key={selectedColor?.hex}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: selectedColor?.hex ?? "#333" }}
          layoutId="color-preview"
        />
      </motion.div>

      <OptionGroup
        label="Color"
        options={product.configurator.colors}
        selected={color}
        onSelect={setColor}
        type="color"
      />
      <OptionGroup
        label="Wheels"
        options={product.configurator.wheels}
        selected={wheels}
        onSelect={setWheels}
      />
      <OptionGroup
        label="Battery"
        options={product.configurator.battery}
        selected={battery}
        onSelect={setBattery}
      />
      <OptionGroup
        label="Roof"
        options={product.configurator.roof}
        selected={roof}
        onSelect={setRoof}
      />
      <OptionGroup
        label="Cargo"
        options={product.configurator.cargoBox}
        selected={cargoBox}
        onSelect={setCargoBox}
      />

      <div className="border-t border-border pt-6">
        <div className="flex justify-between">
          <span className="text-foreground-secondary">Configured price</span>
          <span className="text-2xl font-medium">{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
