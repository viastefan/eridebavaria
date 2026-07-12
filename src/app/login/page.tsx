"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, firstName, lastName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler");

      if (data.user.role === "ADMIN" || data.user.role === "EMPLOYEE") {
        router.push("/admin");
      } else {
        router.push("/garage");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center section-padding pt-28">
      <div className="w-full max-w-md">
        <h1 className="heading-xl text-center">
          {mode === "login" ? "Anmelden" : "Konto erstellen"}
        </h1>
        <p className="mt-3 text-center text-sm text-foreground-secondary">
          Bestellungen, Konfigurationen und Service — alles an einem Ort.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-8">
          {mode === "register" && (
            <>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Vorname"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                required
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nachname"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                required
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
            required
            minLength={8}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Bitte warten …" : mode === "login" ? "Anmelden" : "Registrieren"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-secondary">
          {mode === "login" ? (
            <>
              Noch kein Konto?{" "}
              <button type="button" onClick={() => setMode("register")} className="text-accent hover:underline">
                Registrieren
              </button>
            </>
          ) : (
            <>
              Bereits registriert?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-accent hover:underline">
                Anmelden
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-sm">
          <Link href="/garage" className="text-foreground-secondary hover:text-accent">
            Digital Garage (PIN-Zugang) →
          </Link>
        </p>
      </div>
    </main>
  );
}
