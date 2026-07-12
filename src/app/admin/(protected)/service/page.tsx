"use client";

import { useEffect, useState } from "react";

const statuses = [
  { id: "CREATED", label: "Eingegangen" },
  { id: "REVIEWING", label: "In Prüfung" },
  { id: "APPOINTMENT", label: "Termin" },
  { id: "IN_PROGRESS", label: "In Bearbeitung" },
  { id: "COMPLETED", label: "Abgeschlossen" },
] as const;

interface ServiceRequest {
  id: string;
  productName: string | null;
  problemDescription: string;
  status: string;
  createdAt: string;
  customer: { name: string; email: string };
}

export default function AdminServicePage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/service-requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/service-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-xl">Service</h1>
      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{r.customer.name}</p>
                <p className="text-sm text-foreground-secondary">{r.customer.email}</p>
                {r.productName && (
                  <p className="mt-1 text-sm">{r.productName}</p>
                )}
              </div>
              <select
                value={r.status}
                onChange={(e) => updateStatus(r.id, e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-4 text-sm">{r.problemDescription}</p>
            <p className="mt-2 text-xs text-foreground-secondary">
              {new Date(r.createdAt).toLocaleDateString("de-DE")}
            </p>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-foreground-secondary">Keine Serviceanfragen.</p>
        )}
      </div>
    </div>
  );
}
