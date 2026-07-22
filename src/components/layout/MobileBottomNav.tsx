"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Compass,
  Wrench,
  User,
} from "lucide-react";
import { useStore } from "@/lib/store";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/shop",
    label: "Katalog",
    icon: Compass,
    match: (p: string) =>
      p.startsWith("/shop") || p.startsWith("/product") || p.startsWith("/discover"),
  },
  {
    href: "/service",
    label: "Service",
    icon: Wrench,
    match: (p: string) =>
      p.startsWith("/service") || p.startsWith("/parts") || p.startsWith("/garage"),
  },
  {
    href: "/login",
    label: "Konto",
    icon: User,
    match: (p: string) =>
      p.startsWith("/login") ||
      p.startsWith("/account") ||
      p.startsWith("/portal") ||
      p.startsWith("/admin"),
  },
] as const;

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setCartOpen, cartCount } = useStore();

  if (pathname.startsWith("/product/")) return null;

  return (
    <nav className="mobile-tabbar" aria-label="App-Navigation">
      <div className="mobile-tabbar__inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn("mobile-tabbar__item", active && "mobile-tabbar__item--active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="mobile-tabbar__icon" strokeWidth={active ? 2 : 1.5} />
              <span className="mobile-tabbar__label">{tab.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          className="mobile-tabbar__item"
          onClick={() => setCartOpen(true)}
          aria-label={`Warenkorb${cartCount > 0 ? `, ${cartCount} Artikel` : ""}`}
        >
          <span className="mobile-tabbar__icon-wrap">
            <ShoppingBag className="mobile-tabbar__icon" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="mobile-tabbar__badge">{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </span>
          <span className="mobile-tabbar__label">Warenkorb</span>
        </button>
      </div>
    </nav>
  );
}
