"use client";

import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  customerType: string;
  _count: { orders: number; customRequests: number; serviceRequests: number };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-xl">Kunden</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-foreground-secondary">
              <th className="p-4">Name</th>
              <th className="p-4">E-Mail</th>
              <th className="p-4">Typ</th>
              <th className="p-4">Bestellungen</th>
              <th className="p-4">Anfragen</th>
              <th className="p-4">Service</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border/50">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.customerType}</td>
                <td className="p-4">{c._count.orders}</td>
                <td className="p-4">{c._count.customRequests}</td>
                <td className="p-4">{c._count.serviceRequests}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="p-8 text-center text-foreground-secondary">
            Noch keine Kunden.
          </p>
        )}
      </div>
    </div>
  );
}
