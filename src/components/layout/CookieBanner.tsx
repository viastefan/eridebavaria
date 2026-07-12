"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  acceptAllCookies,
  denyOptionalCookies,
  getCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookie-consent";
import { CookieSettings } from "./CookieSettings";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const existing = getCookiePreferences();
    if (!existing?.decidedAt) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    setPrefs(existing);
  }, []);

  const handleAccept = () => {
    const saved = acceptAllCookies();
    setPrefs(saved);
    setVisible(false);
    setSettingsOpen(false);
  };

  const handleDeny = () => {
    const saved = denyOptionalCookies();
    setPrefs(saved);
    setVisible(false);
    setSettingsOpen(false);
  };

  const handleSaveSettings = (next: Pick<CookiePreferences, "analytics" | "marketing">) => {
    const saved = saveCookiePreferences({
      necessary: true,
      analytics: next.analytics,
      marketing: next.marketing,
    });
    setPrefs(saved);
    setVisible(false);
    setSettingsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.aside
            role="dialog"
            aria-label="Cookie-Einstellungen"
            className="cookie-banner"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="cookie-banner__text">
              Diese Website verwendet Tracking-Technologien. Sie können der Nutzung
              zustimmen oder sie ablehnen.
            </p>

            <div className="cookie-banner__actions">
              <div className="cookie-banner__actions-left">
                <button
                  type="button"
                  onClick={handleDeny}
                  className="cookie-banner__btn cookie-banner__btn--ghost"
                >
                  Ablehnen
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="cookie-banner__btn cookie-banner__btn--ghost"
                >
                  Alle akzeptieren
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="cookie-banner__btn cookie-banner__btn--primary"
              >
                Einstellungen
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <CookieSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        initial={prefs ?? { necessary: true, analytics: false, marketing: false, decidedAt: "" }}
      />
    </>
  );
}
