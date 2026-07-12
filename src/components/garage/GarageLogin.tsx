"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatGaragePin } from "@/lib/garage-types";
import type { GarageAccessData } from "@/lib/garage-types";
import { platform } from "@/lib/platform";

interface GarageLoginProps {
  onAuthenticated: (access: GarageAccessData) => void;
}

export function GarageLogin({ onAuthenticated }: GarageLoginProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/garage/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      onAuthenticated(data.access as GarageAccessData);
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="garage-login">
      <div className="section-padding mx-auto flex min-h-[calc(100dvh-5rem)] max-w-lg items-center justify-center py-16">
        <motion.div
          className="garage-login__card w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="garage-login__icon" aria-hidden>
            <KeyRound className="h-5 w-5" />
          </div>

          <span className="garage-login__eyebrow">Digital Garage</span>
          <h1 className="heading-xl mt-3">{platform.garage.title}</h1>
          <p className="mt-3 text-foreground-secondary">
            Melden Sie sich mit Ihrem persönlichen Garage-PIN an. Den Code erhalten Sie beim Kauf
            Ihres Fahrzeugs in den Unterlagen von eRide Bavaria.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-4">
            <div>
              <label htmlFor="garage-pin" className="garage-login__label">
                Garage-PIN
              </label>
              <input
                id="garage-pin"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="EB-739-204"
                value={pin}
                onChange={(e) => setPin(formatGaragePin(e.target.value))}
                className="garage-login__input"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="garage-login__error" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading || pin.replace(/[^A-Z0-9]/gi, "").length < 6} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Wird geprüft …
                </>
              ) : (
                "Garage öffnen"
              )}
            </Button>
          </form>

          <p className="garage-login__hint mt-8">
            PIN vergessen oder noch kein Fahrzeug?{" "}
            <a href="/#beratung" className="text-accent hover:underline">
              Beratung anfragen
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
