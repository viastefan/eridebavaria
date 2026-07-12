"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";

const statuses = [
  "CREATED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
] as const;

interface Order {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-xl">Bestellungen</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-foreground-secondary">
              <th className="p-4">Nr.</th>
              <th className="p-4">Kunde</th>
              <th className="p-4">Zahlung</th>
              <th className="p-4">Summe</th>
              <th className="p-4">Status</th>
              <th className="p-4">Datum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border/50">
                <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-4">
                  {o.firstName} {o.lastName}
                </td>
                <td className="p-4">{o.paymentMethod}</td>
                <td className="p-4">{formatPrice(o.total)}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-xs text-foreground-secondary">
                  {new Date(o.createdAt).toLocaleDateString("de-DE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-foreground-secondary">
            Noch keine Bestellungen.
          </p>
        )}
      </div>
    </div>
  );
}
