"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const stages = [
  { id: "NEW_REQUEST", label: "Neue Anfrage" },
  { id: "CUSTOMER_CONTACTED", label: "Kontaktiert" },
  { id: "NEEDS_ANALYSIS", label: "Bedarfsanalyse" },
  { id: "CONFIGURATION_CREATED", label: "Konfiguration" },
  { id: "OFFER_SENT", label: "Angebot gesendet" },
  { id: "ORDER_CONFIRMED", label: "Bestätigt" },
  { id: "PRODUCTION_DELIVERY", label: "Produktion" },
  { id: "COMPLETED", label: "Abgeschlossen" },
] as const;

interface Opportunity {
  id: string;
  title: string;
  stage: string;
  estimatedValue: number | null;
  customer: { id: string; name: string; email: string };
  customRequest?: { message: string; product?: { name: string } };
}

export default function PipelinePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pipeline")
      .then((r) => r.json())
      .then((d) => setOpportunities(d.opportunities ?? []))
      .finally(() => setLoading(false));
  }, []);

  const moveStage = async (id: string, stage: string) => {
    await fetch("/api/admin/pipeline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage }),
    });
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)));
  };

  const createOffer = async (o: Opportunity) => {
    const value = o.estimatedValue ?? 0;
    await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: o.customer.id,
        opportunityId: o.id,
        items: [{ name: o.title, price: value || 1, quantity: 1 }],
      }),
    });
    await moveStage(o.id, "OFFER_SENT");
    alert("Angebot erstellt.");
  };

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-xl">Vertriebspipeline</h1>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => {
          const items = opportunities.filter((o) => o.stage === stage.id);
          return (
            <div key={stage.id} className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                {stage.label} ({items.length})
              </h2>
              <div className="space-y-2">
                {items.map((o) => (
                  <div key={o.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium">{o.title}</p>
                    <p className="text-xs text-foreground-secondary">{o.customer.name}</p>
                    {o.customRequest && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{o.customRequest.message}</p>
                    )}
                    <select
                      value={o.stage}
                      onChange={(e) => moveStage(o.id, e.target.value)}
                      className="mt-2 w-full rounded border border-border bg-background px-2 py-1 text-xs"
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                    {o.stage !== "OFFER_SENT" && o.stage !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => createOffer(o)}
                        className="mt-2 w-full text-xs text-accent hover:underline"
                      >
                        Angebot erstellen
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
