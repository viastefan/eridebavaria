"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/products";

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Offer {
  id: string;
  offerNumber: string;
  status: string;
  total: number;
  createdAt: string;
  customer: Customer;
  opportunity?: { id: string; title: string } | null;
}

interface Opportunity {
  id: string;
  title: string;
  customer: Customer;
  estimatedValue: number | null;
}

interface OfferItem {
  name: string;
  price: number;
  quantity: number;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Entwurf",
  SENT: "Gesendet",
  ACCEPTED: "Angenommen",
  REJECTED: "Abgelehnt",
  EXPIRED: "Abgelaufen",
};

export default function AdminOffersPage() {
  const searchParams = useSearchParams();
  const prefillOpportunityId = searchParams.get("opportunityId");
  const prefillCustomerId = searchParams.get("customerId");

  const [offers, setOffers] = useState<Offer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(!!prefillOpportunityId);

  const [customerId, setCustomerId] = useState(prefillCustomerId ?? "");
  const [opportunityId, setOpportunityId] = useState(prefillOpportunityId ?? "");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [items, setItems] = useState<OfferItem[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/offers").then((r) => r.json()),
      fetch("/api/admin/customers").then((r) => r.json()),
      fetch("/api/admin/pipeline").then((r) => r.json()),
    ])
      .then(([offersData, customersData, pipelineData]) => {
        setOffers(offersData.offers ?? []);
        setCustomers(customersData.customers ?? []);
        setOpportunities(pipelineData.opportunities ?? []);

        if (prefillOpportunityId) {
          const opp = (pipelineData.opportunities ?? []).find(
            (o: Opportunity) => o.id === prefillOpportunityId
          );
          if (opp) {
            setCustomerId(opp.customer.id);
            setItemName(opp.title.replace("Anfrage: ", ""));
            if (opp.estimatedValue) setItemPrice(String(opp.estimatedValue));
          }
        }
      })
      .finally(() => setLoading(false));
  }, [prefillOpportunityId]);

  const addItem = () => {
    const price = parseFloat(itemPrice);
    if (!itemName.trim() || isNaN(price)) return;
    setItems((prev) => [...prev, { name: itemName.trim(), price, quantity: 1 }]);
    setItemName("");
    setItemPrice("");
  };

  const createOffer = async () => {
    if (!customerId || items.length === 0) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          opportunityId: opportunityId || undefined,
          items,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setOffers((prev) => [data.offer, ...prev]);
      setShowForm(false);
      setItems([]);
      setNotes("");
      setOpportunityId("");
    } finally {
      setCreating(false);
    }
  };

  const customerOpportunities = opportunities.filter((o) => o.customer.id === customerId);

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-xl">Angebote</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-foreground px-4 py-2 text-sm text-background"
        >
          {showForm ? "Abbrechen" : "Angebot erstellen"}
        </button>
      </div>

      {showForm && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-medium">Neues Angebot</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted">Kunde *</label>
              <select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setOpportunityId("");
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Kunde wählen …</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Vertriebschance</label>
              <select
                value={opportunityId}
                onChange={(e) => setOpportunityId(e.target.value)}
                disabled={!customerId}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Optional …</option>
                {customerOpportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Position (z. B. EEC Star 6.0 konfiguriert)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="Preis €"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addItem}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Hinzufügen
            </button>
          </div>

          {items.length > 0 && (
            <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Gesamt</span>
                <span>
                  {formatPrice(items.reduce((s, i) => s + i.price * i.quantity, 0))}
                </span>
              </div>
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne Notizen / Konditionen …"
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={createOffer}
            disabled={creating || !customerId || items.length === 0}
            className="rounded-lg bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {creating ? "Wird erstellt …" : "Angebot senden"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {offers.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono font-medium">{o.offerNumber}</p>
                <p className="text-sm text-foreground-secondary">
                  {o.customer.name} · {o.customer.email}
                </p>
                {o.opportunity && (
                  <p className="mt-1 text-xs text-muted">{o.opportunity.title}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(o.total)}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {statusLabels[o.status] ?? o.status}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              {new Date(o.createdAt).toLocaleDateString("de-DE")}
            </p>
          </div>
        ))}
        {offers.length === 0 && (
          <p className="text-foreground-secondary">Noch keine Angebote.</p>
        )}
      </div>
    </div>
  );
}
