"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useShowroom } from "./ShowroomProvider";
import { showroomLabels } from "@/lib/showroom-labels";

export function ShowroomParts() {
  const {
    data,
    selectedPart,
    setSelectedPart,
    hoveredPart,
    setHoveredPart,
    aiResult,
    aiAnalyzing,
    runAIIdentification,
    setMode,
  } = useShowroom();
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = data.parts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const active = data.parts.find((p) => p.id === selectedPart);

  return (
    <section className="section-padding border-t border-border py-24 md:py-32">
      <div className="mb-16 max-w-2xl">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
          {showroomLabels.partsLibrary}
        </span>
        <h2 className="heading-xl mt-4">Ersatzteile & Komponenten</h2>
        <p className="mt-4 text-foreground-secondary">
          Jedes Bauteil original, kompatibel und sofort verfügbar — kein PDF-Katalog,
          sondern ein interaktives Teile-Ökosystem.
        </p>
      </div>

      <div className="mb-12 grid gap-6 lg:grid-cols-2">
        {/* AI Identification */}
        <div className="rounded-3xl border border-border bg-card/40 p-8 md:p-10">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <div>
              <h3 className="text-lg font-medium">{showroomLabels.aiTitle}</h3>
              <p className="text-sm text-foreground-secondary">
                {showroomLabels.aiSubtitle}
              </p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) runAIIdentification(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={aiAnalyzing}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-12 transition-all duration-700 hover:border-accent/40 hover:bg-accent/5 disabled:opacity-50"
            data-cursor="pointer"
          >
            {aiAnalyzing ? (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-sm text-foreground-secondary"
              >
                {showroomLabels.aiAnalyzing}
              </motion.span>
            ) : (
              <>
                <Upload className="h-5 w-5 text-accent" />
                <span className="text-sm">{showroomLabels.aiUpload}</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-6"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  {showroomLabels.aiResult}
                </p>
                <p className="mt-2 text-lg font-medium">{aiResult.partName}</p>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {showroomLabels.aiConfidence}: {aiResult.confidence}%
                </p>
                <p className="mt-4 text-sm text-foreground-secondary">
                  {showroomLabels.aiMaintenance}: {aiResult.maintenanceTip}
                </p>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-foreground-secondary">
                    {showroomLabels.aiTools}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiResult.tools.map((t) => (
                      <span key={t} className="rounded-full border border-border px-3 py-1 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMode("exploded")}
                  className="mt-4 text-sm text-accent hover:underline"
                >
                  {showroomLabels.aiHighlight} →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Part detail */}
        <div className="rounded-3xl border border-border bg-card/40 p-8 md:p-10">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
                {showroomLabels.originalPart}
              </span>
              <h3 className="mt-3 text-2xl font-medium">{active.name}</h3>
              <p className="mt-2 text-3xl font-medium">{formatPrice(active.price)}</p>
              <p className="mt-1 text-sm text-foreground-secondary">
                {showroomLabels.availability[active.availability]}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-foreground-secondary">
                {active.description}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-foreground-secondary">{showroomLabels.installDifficulty}</p>
                  <p className="mt-1 font-medium">
                    {showroomLabels.difficulty[active.installDifficulty]}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-secondary">{showroomLabels.installTime}</p>
                  <p className="mt-1 font-medium">{active.installTime}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary">{showroomLabels.deliveryTime}</p>
                  <p className="mt-1 font-medium">
                    {active.deliveryDays} {showroomLabels.days}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-secondary">{showroomLabels.compatibility}</p>
                  <p className="mt-1 font-medium">{active.compatibility.join(", ")}</p>
                </div>
              </div>
              <div className="mt-8 aspect-video rounded-2xl border border-border bg-gradient-to-br from-accent/5 to-transparent" />
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center text-center text-foreground-secondary">
              <p className="max-w-xs text-sm">
                Wähle ein Bauteil aus dem Katalog oder nutze die KI-Erkennung.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-foreground-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={showroomLabels.searchParts}
          className="w-full rounded-2xl border border-border bg-card/50 py-4 pr-5 pl-12 outline-none transition-colors focus:border-accent/40"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((part) => (
          <button
            key={part.id}
            type="button"
            onClick={() => {
              setSelectedPart(part.id);
              setMode("parts");
            }}
            onMouseEnter={() => setHoveredPart(part.id)}
            onMouseLeave={() => setHoveredPart(null)}
            className={`rounded-2xl border p-5 text-left transition-all duration-700 ${
              selectedPart === part.id
                ? "border-accent/40 bg-accent/5"
                : "border-border bg-card/30 hover:border-foreground/10 hover:bg-card/50"
            }`}
            data-cursor="pointer"
          >
            <span className="text-[10px] uppercase tracking-[0.15em] text-foreground-secondary">
              {part.category}
            </span>
            <p className="mt-2 font-medium">{part.name}</p>
            <p className="mt-2 text-sm text-foreground-secondary">
              {formatPrice(part.price)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
