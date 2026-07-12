"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Anmeldung fehlgeschlagen");
      if (data.user.role !== "ADMIN" && data.user.role !== "EMPLOYEE") {
        throw new Error("Kein Admin-Zugang");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center section-padding">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8">
        <h1 className="heading-lg">Admin Login</h1>
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
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Anmelden …" : "Anmelden"}
        </Button>
      </form>
    </main>
  );
}
