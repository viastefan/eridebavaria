"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

interface AccountData {
  customer: { name: string; email: string } | null;
  orders: { id: string; orderNumber: string; status: string; total: number }[];
  configurations: { id: string; summary: string; estimatedPrice: number; product: { name: string } }[];
  offers: { id: string; offerNumber: string; status: string; total: number }[];
  serviceRequests: { id: string; problemDescription: string; status: string }[];
  vehicles: { id: string; productName: string; warrantyUntil: string | null }[];
}

const statusLabels: Record<string, string> = {
  CREATED: "Eingegangen",
  PAYMENT_PENDING: "Zahlung ausstehend",
  CONFIRMED: "Bestätigt",
  PROCESSING: "In Bearbeitung",
  SHIPPING: "Versand",
  COMPLETED: "Abgeschlossen",
  SENT: "Gesendet",
  ACCEPTED: "Angenommen",
  REVIEWING: "In Prüfung",
  APPOINTMENT: "Termin",
  IN_PROGRESS: "In Bearbeitung",
};

export function AccountGaragePanel() {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data?.customer) return null;

  return (
    <section className="mb-12 rounded-2xl border border-border bg-card/60 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Mein Konto</p>
          <h2 className="heading-md mt-2">Willkommen, {data.customer.name}</h2>
          <p className="mt-1 text-sm text-foreground-secondary">{data.customer.email}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.reload();
          }}
          className="text-xs text-muted hover:text-foreground"
        >
          Abmelden
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <h3 className="text-sm font-medium">Meine Fahrzeuge</h3>
          {data.vehicles.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Noch keine Fahrzeuge registriert.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.vehicles.map((v) => (
                <li key={v.id}>
                  <span className="font-medium">{v.productName}</span>
                  {v.warrantyUntil && (
                    <span className="ml-2 text-xs text-muted">
                      Garantie bis{" "}
                      {new Date(v.warrantyUntil).toLocaleDateString("de-DE")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border p-5">
          <h3 className="text-sm font-medium">Angebote</h3>
          {data.offers.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Noch keine Angebote.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.offers.map((o) => (
                <li key={o.id} className="flex justify-between gap-2">
                  <span>{o.offerNumber}</span>
                  <span className="text-muted">{statusLabels[o.status] ?? o.status}</span>
                  <span>{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border p-5">
          <h3 className="text-sm font-medium">Konfigurationen</h3>
          {data.configurations.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Keine gespeicherten Konfigurationen.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.configurations.map((c) => (
                <li key={c.id}>
                  <p className="font-medium">{c.product.name}</p>
                  <p className="text-xs text-muted line-clamp-1">{c.summary}</p>
                  <p className="mt-0.5">{formatPrice(c.estimatedPrice)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border p-5">
          <h3 className="text-sm font-medium">Bestellungen</h3>
          {data.orders.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Noch keine Bestellungen.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.orders.map((o) => (
                <li key={o.id} className="flex justify-between gap-2">
                  <span className="font-mono text-xs">{o.orderNumber}</span>
                  <span className="text-muted">{statusLabels[o.status] ?? o.status}</span>
                  <span>{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border p-5">
        <h3 className="text-sm font-medium">Serviceanfragen</h3>
        {data.serviceRequests.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Keine offenen Serviceanfragen.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {data.serviceRequests.map((s) => (
              <li key={s.id}>
                <p className="line-clamp-2">{s.problemDescription}</p>
                <p className="text-xs text-muted">{statusLabels[s.status] ?? s.status}</p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/service" className="mt-3 inline-block text-xs text-accent hover:underline">
          Neue Serviceanfrage →
        </Link>
      </div>
    </section>
  );
}

export function AccountGarageLoginPrompt() {
  return (
    <p className="mb-8 text-center text-sm text-muted">
      Mit Konto anmelden?{" "}
      <Link href="/login" className="text-accent hover:underline">
        Anmelden
      </Link>{" "}
      — oder PIN-Zugang für Ihr Fahrzeug unten.
    </p>
  );
}
