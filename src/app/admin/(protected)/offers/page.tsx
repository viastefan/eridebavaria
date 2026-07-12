"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";

interface Offer {
  id: string;
  offerNumber: string;
  status: string;
  total: number;
  customer: { name: string; email: string };
  createdAt: string;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/offers")
      .then((r) => r.json())
      .then((d) => setOffers(d.offers ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-xl">Angebote</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-foreground-secondary">
              <th className="p-4">Nr.</th>
              <th className="p-4">Kunde</th>
              <th className="p-4">Status</th>
              <th className="p-4">Summe</th>
              <th className="p-4">Datum</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id} className="border-b border-border/50">
                <td className="p-4 font-mono text-xs">{o.offerNumber}</td>
                <td className="p-4">{o.customer.name}</td>
                <td className="p-4">{o.status}</td>
                <td className="p-4">{formatPrice(o.total)}</td>
                <td className="p-4 text-xs">{new Date(o.createdAt).toLocaleDateString("de-DE")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {offers.length === 0 && (
          <p className="p-8 text-center text-foreground-secondary">Noch keine Angebote.</p>
        )}
      </div>
    </div>
  );
}
