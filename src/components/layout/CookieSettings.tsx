"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { CookiePreferences } from "@/lib/cookie-consent";

interface CookieSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (prefs: Pick<CookiePreferences, "analytics" | "marketing">) => void;
  initial: CookiePreferences;
}

const categories = [
  {
    id: "necessary" as const,
    title: "Notwendig",
    description: "Erforderlich für Grundfunktionen wie Warenkorb und Sicherheit.",
    locked: true,
  },
  {
    id: "analytics" as const,
    title: "Analyse",
    description: "Hilft uns, die Website zu verbessern und Nutzung zu verstehen.",
    locked: false,
  },
  {
    id: "marketing" as const,
    title: "Marketing",
    description: "Personalisierte Inhalte und Kampagnen-Messung.",
    locked: false,
  },
];

export function CookieSettings({ open, onClose, onSave, initial }: CookieSettingsProps) {
  const [analytics, setAnalytics] = useState(initial.analytics);
  const [marketing, setMarketing] = useState(initial.marketing);

  useEffect(() => {
    if (open) {
      setAnalytics(initial.analytics);
      setMarketing(initial.marketing);
    }
  }, [open, initial.analytics, initial.marketing]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Cookie-Einstellungen"
            className="cookie-settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium tracking-tight text-white">
                  Cookie-Einstellungen
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Wählen Sie, welche Technologien wir verwenden dürfen.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Schließen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {categories.map((cat) => {
                const enabled =
                  cat.id === "necessary" ? true : cat.id === "analytics" ? analytics : marketing;
                const toggle =
                  cat.id === "analytics"
                    ? () => setAnalytics((v) => !v)
                    : cat.id === "marketing"
                      ? () => setMarketing((v) => !v)
                      : undefined;

                return (
                  <div key={cat.id} className="cookie-settings__row">
                    <div>
                      <p className="text-sm font-medium text-white">{cat.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45">
                        {cat.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={cat.locked}
                      onClick={toggle}
                      className={`cookie-settings__toggle ${enabled ? "is-on" : ""} ${
                        cat.locked ? "is-locked" : ""
                      }`}
                      aria-pressed={enabled}
                    >
                      <span className="cookie-settings__knob" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="cookie-banner__btn cookie-banner__btn--ghost"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => onSave({ analytics, marketing })}
                className="cookie-banner__btn cookie-banner__btn--primary"
              >
                Speichern
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
