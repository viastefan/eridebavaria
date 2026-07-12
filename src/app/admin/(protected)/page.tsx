import { getAdminDashboardStats } from "@/lib/orders";
import { getPipelineOverview } from "@/lib/pipeline";
import { formatPrice } from "@/lib/products";
import Link from "next/link";

const stageLabels: Record<string, string> = {
  NEW_REQUEST: "Neue Anfrage",
  CUSTOMER_CONTACTED: "Kontaktiert",
  NEEDS_ANALYSIS: "Bedarfsanalyse",
  CONFIGURATION_CREATED: "Konfiguration",
  OFFER_SENT: "Angebot gesendet",
  ORDER_CONFIRMED: "Bestätigt",
  PRODUCTION_DELIVERY: "Produktion",
  COMPLETED: "Abgeschlossen",
};

export default async function AdminDashboardPage() {
  const [stats, pipeline] = await Promise.all([
    getAdminDashboardStats(),
    getPipelineOverview(),
  ]);

  const kpis = [
    { label: "Neue Anfragen", value: stats.newInquiries, href: "/admin/pipeline" },
    { label: "Offene Verkäufe", value: stats.openOpportunities, href: "/admin/pipeline" },
    { label: "Offene Angebote", value: stats.pendingOffers, href: "/admin/pipeline" },
    { label: "Aktive Bestellungen", value: stats.activeOrders, href: "/admin/orders" },
    { label: "Service offen", value: stats.openService, href: "/admin/service" },
    { label: "Umsatz (bezahlt)", value: formatPrice(stats.revenue), href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-xl">Dashboard</h1>
        <p className="mt-2 text-foreground-secondary">
          Übersicht über Anfragen, Verkauf und Aufträge.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/30"
          >
            <p className="text-xs uppercase tracking-wider text-foreground-secondary">
              {kpi.label}
            </p>
            <p className="mt-2 text-3xl font-semibold">{kpi.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="heading-md mb-4">Vertriebspipeline</h2>
          <div className="space-y-2">
            {pipeline.stages.map((s) => (
              <div key={s.stage} className="flex items-center justify-between text-sm">
                <span>{stageLabels[s.stage] ?? s.stage}</span>
                <span className="font-medium">{s._count.id}</span>
              </div>
            ))}
            {pipeline.stages.length === 0 && (
              <p className="text-sm text-foreground-secondary">Noch keine Opportunities.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="heading-md mb-4">Neueste Anfragen</h2>
          <div className="space-y-3">
            {stats.recentRequests.map((r) => (
              <div key={r.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="font-medium">{r.customer?.name ?? r.email}</p>
                <p className="text-foreground-secondary line-clamp-2">{r.message}</p>
                <p className="mt-1 text-xs text-muted">
                  {r.product?.name ?? r.productName ?? "Allgemein"} · {r.status}
                </p>
              </div>
            ))}
            {stats.recentRequests.length === 0 && (
              <p className="text-sm text-foreground-secondary">Keine Anfragen.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="heading-md mb-4">Neueste Bestellungen</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground-secondary">
                <th className="pb-3 pr-4">Nr.</th>
                <th className="pb-3 pr-4">Kunde</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Summe</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 pr-4">
                    {o.firstName} {o.lastName}
                  </td>
                  <td className="py-3 pr-4">{o.status}</td>
                  <td className="py-3">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
