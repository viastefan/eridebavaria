import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogOut } from "lucide-react";

const nav = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/pipeline", label: "Vertrieb" },
  { href: "/admin/offers", label: "Angebote" },
  { href: "/admin/orders", label: "Bestellungen" },
  { href: "/admin/customers", label: "Kunden" },
  { href: "/admin/products", label: "Produkte" },
  { href: "/admin/offers", label: "Angebote" },
  { href: "/admin/service", label: "Service" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "EMPLOYEE")) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-sm font-semibold tracking-wide">
              eRide Admin
            </Link>
            <nav className="hidden gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-foreground-secondary transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-foreground-secondary">
              {session.firstName} · {session.role}
            </span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-foreground-secondary hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
