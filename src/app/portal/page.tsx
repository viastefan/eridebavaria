"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { ServiceRequestForm } from "@/components/garage/ServiceRequestForm";

interface AccountData {
  customer: { name: string; email: string } | null;
  orders: { id: string; orderNumber: string; status: string; total: number; createdAt: string }[];
  configurations: { id: string; summary: string; estimatedPrice: number; product: { name: string } }[];
  offers: { id: string; offerNumber: string; status: string; total: number }[];
  serviceRequests: { id: string; problemDescription: string; status: string }[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  CREATED: "Erfasst",
  PAYMENT_PENDING: "Zahlung ausstehend",
  CONFIRMED: "Bestätigt",
  PROCESSING: "In Bearbeitung",
  SHIPPING: "Versand",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
  SENT: "Gesendet",
  ACCEPTED: "Angenommen",
  REVIEWING: "In Prüfung",
  APPOINTMENT: "Termin",
  IN_PROGRESS: "In Arbeit",
};

export default function PortalPage() {
  const [data, setData] = useState<AccountData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/account").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/notifications").then((r) => (r.ok ? r.json() : { notifications: [] })),
    ])
      .then(([account, notif]) => {
        setData(account);
        setNotifications(notif?.notifications ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-28">
        <p className="text-foreground-secondary">Laden …</p>
      </main>
    );
  }

  if (!data?.customer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center section-padding pt-28">
        <h1 className="heading-lg">Mein Konto</h1>
        <p className="mt-4 text-foreground-secondary">
          Melden Sie sich an, um Bestellungen und Angebote zu sehen.
        </p>
        <Link href="/login" className="mt-6 text-accent hover:underline">
          Anmelden / Registrieren →
        </Link>
        <Link href="/garage" className="mt-3 block text-sm text-foreground-secondary hover:text-accent">
          Digital Garage (PIN-Zugang)
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-4xl space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-xl">Mein Konto</h1>
            <p className="mt-2 text-foreground-secondary">Willkommen, {data.customer.name}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="text-sm text-foreground-secondary hover:text-foreground"
          >
            Abmelden
          </button>
        </div>

        {notifications.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="heading-md mb-4">Benachrichtigungen</h2>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className={`text-sm ${n.read ? "opacity-60" : ""}`}>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-foreground-secondary">{n.message}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="heading-md mb-4">Bestellungen</h2>
          {data.orders.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Noch keine Bestellungen.</p>
          ) : (
            <div className="space-y-3">
              {data.orders.map((o) => (
                <div key={o.id} className="flex justify-between gap-4 text-sm">
                  <span className="font-mono">{o.orderNumber}</span>
                  <span>{statusLabels[o.status] ?? o.status}</span>
                  <span>{formatPrice(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="heading-md mb-4">Konfigurationen</h2>
          {data.configurations.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Keine gespeicherten Konfigurationen.</p>
          ) : (
            <div className="space-y-3">
              {data.configurations.map((c) => (
                <div key={c.id} className="text-sm">
                  <p className="font-medium">{c.product.name}</p>
                  <p className="text-foreground-secondary">{c.summary}</p>
                  <p className="mt-1">{formatPrice(c.estimatedPrice)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="heading-md mb-4">Angebote</h2>
          {data.offers.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Noch keine Angebote.</p>
          ) : (
            <div className="space-y-3">
              {data.offers.map((o) => (
                <div key={o.id} className="flex justify-between text-sm">
                  <span>{o.offerNumber}</span>
                  <span>{statusLabels[o.status] ?? o.status}</span>
                  <span>{formatPrice(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="heading-md">Service</h2>
            <Button variant="secondary" onClick={() => setShowServiceForm(!showServiceForm)}>
              {showServiceForm ? "Schließen" : "Neue Anfrage"}
            </Button>
          </div>
          {showServiceForm && (
            <div className="mb-6">
              <ServiceRequestForm />
            </div>
          )}
          {data.serviceRequests.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Keine Serviceanfragen.</p>
          ) : (
            <div className="space-y-3">
              {data.serviceRequests.map((s) => (
                <div key={s.id} className="text-sm">
                  <p>{s.problemDescription}</p>
                  <p className="text-xs text-muted">{statusLabels[s.status] ?? s.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/garage">
            <Button variant="secondary">Digital Garage</Button>
          </Link>
          <Link href="/shop">
            <Button>Katalog</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
