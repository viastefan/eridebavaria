"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { labels, availabilityLabels } from "@/lib/labels";
import {
  defaultShowroomFilters,
  usageTags,
  type ShowroomFilterState,
  countActiveFilters,
} from "@/lib/showroom-filters";

interface ShowroomDiscoveryPanelProps {
  filters: ShowroomFilterState;
  onChange: (filters: ShowroomFilterState) => void;
  resultCount: number;
  flyoutOpen?: boolean;
  onFlyoutChange?: (open: boolean) => void;
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="discovery-section">
      <button
        type="button"
        className="discovery-section__toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <ChevronDown
          className={`discovery-section__chevron ${open ? "discovery-section__chevron--open" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="discovery-section__body"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RangeControl({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="discovery-range">
      <div className="discovery-range__header">
        <span>{label}</span>
        <span className="discovery-range__value">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="discovery-range__input"
      />
    </div>
  );
}

function FilterContent({
  filters,
  onChange,
}: {
  filters: ShowroomFilterState;
  onChange: (f: ShowroomFilterState) => void;
}) {
  const toggleUsage = (id: (typeof usageTags)[number]["id"]) => {
    const usage = filters.usage.includes(id)
      ? filters.usage.filter((u) => u !== id)
      : [...filters.usage, id];
    onChange({ ...filters, usage });
  };

  const toggleSeat = (seat: number) => {
    const seats = filters.seats.includes(seat)
      ? filters.seats.filter((s) => s !== seat)
      : [...filters.seats, seat];
    onChange({ ...filters, seats });
  };

  return (
    <div className="discovery-panel__sections">
      <div className="discovery-search">
        <Search className="discovery-search__icon" strokeWidth={1.5} />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Fahrzeug, Einsatz, Spezifikation …"
          className="discovery-search__input"
        />
      </div>

      <FilterSection title="Einsatzbereich">
        <div className="discovery-chips">
          {usageTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`discovery-chip ${filters.usage.includes(tag.id) ? "discovery-chip--active" : ""}`}
              onClick={() => toggleUsage(tag.id)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Spezifikationen">
        <div className="discovery-ranges">
          <RangeControl
            label="Reichweite"
            min={0}
            max={350}
            step={10}
            value={filters.rangeMin}
            display={`${filters.rangeMin}+ km`}
            onChange={(v) => onChange({ ...filters, rangeMin: v })}
          />
          <RangeControl
            label="Batterie"
            min={0}
            max={20}
            step={1}
            value={filters.batteryMin}
            display={filters.batteryMin > 0 ? `${filters.batteryMin}+ kWh` : "Alle"}
            onChange={(v) => onChange({ ...filters, batteryMin: v })}
          />
          <RangeControl
            label="Leistung"
            min={0}
            max={15}
            step={1}
            value={filters.powerMin}
            display={filters.powerMin > 0 ? `${filters.powerMin}+ kW` : "Alle"}
            onChange={(v) => onChange({ ...filters, powerMin: v })}
          />
          <RangeControl
            label="Geschwindigkeit"
            min={0}
            max={150}
            step={5}
            value={filters.speedMin}
            display={filters.speedMin > 0 ? `${filters.speedMin}+ km/h` : "Alle"}
            onChange={(v) => onChange({ ...filters, speedMin: v })}
          />
          <RangeControl
            label="Zuladung"
            min={0}
            max={600}
            step={25}
            value={filters.payloadMin}
            display={filters.payloadMin > 0 ? `${filters.payloadMin}+ kg` : "Alle"}
            onChange={(v) => onChange({ ...filters, payloadMin: v })}
          />
          <RangeControl
            label="Preis bis"
            min={0}
            max={50000}
            step={500}
            value={filters.priceMax}
            display={`€${(filters.priceMax / 1000).toFixed(0)}k`}
            onChange={(v) => onChange({ ...filters, priceMax: v })}
          />
        </div>
      </FilterSection>

      <FilterSection title="Sitze" defaultOpen={false}>
        <div className="discovery-chips">
          {[1, 2, 4].map((seat) => (
            <button
              key={seat}
              type="button"
              className={`discovery-chip ${filters.seats.includes(seat) ? "discovery-chip--active" : ""}`}
              onClick={() => toggleSeat(seat)}
            >
              {seat} {seat === 1 ? "Sitz" : "Sitze"}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Verfügbarkeit" defaultOpen={false}>
        <div className="discovery-chips">
          {(["in-stock", "pre-order"] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`discovery-chip ${filters.availability.includes(status) ? "discovery-chip--active" : ""}`}
              onClick={() => {
                const availability = filters.availability.includes(status)
                  ? filters.availability.filter((s) => s !== status)
                  : [...filters.availability, status];
                onChange({ ...filters, availability });
              }}
            >
              {availabilityLabels[status]}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export function ShowroomDiscoveryPanel({
  filters,
  onChange,
  resultCount,
  flyoutOpen = false,
  onFlyoutChange,
}: ShowroomDiscoveryPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);
  const panelOpen = flyoutOpen || mobileOpen;
  const closePanel = () => {
    onFlyoutChange?.(false);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="discovery-mobile-trigger"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
        Filter
        {activeCount > 0 && <span className="discovery-mobile-trigger__badge">{activeCount}</span>}
      </button>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className="discovery-flyout__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />
            <motion.aside
              className="discovery-flyout"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="discovery-flyout__head">
                <h3 className="discovery-flyout__title">Filter</h3>
                <button type="button" onClick={closePanel} aria-label="Schließen">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="discovery-flyout__body">
                <FilterContent filters={filters} onChange={onChange} />
              </div>
              <div className="discovery-flyout__footer">
                {activeCount > 0 && (
                  <button
                    type="button"
                    className="discovery-flyout__reset"
                    onClick={() => onChange(defaultShowroomFilters)}
                  >
                    {labels.clearFilters}
                  </button>
                )}
                <button type="button" className="discovery-flyout__apply" onClick={closePanel}>
                  {resultCount} Ergebnisse
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
