"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@teispace/next-themes";
import { Search, ShoppingBag, User } from "lucide-react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { useStore } from "@/lib/store";
import { mainNav, accountNav } from "@/lib/design";

interface SessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Navigation() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);
  const { setSearchOpen, setCartOpen, cartCount } = useStore();
  const lenis = useLenis();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setSession(d.user))
      .catch(() => {});
  }, [pathname]);

  const isCinematicPage = pathname === "/" || pathname.startsWith("/product/");

  useEffect(() => {
    const heroId = pathname === "/" ? "hero" : pathname.startsWith("/product/") ? "product-hero" : null;

    const onScroll = (y: number) => {
      const nextScrolled = y > 16;
      let nextPastHero = true;
      if (heroId) {
        const hero = document.getElementById(heroId);
        nextPastHero = hero ? y >= hero.offsetHeight - 72 : y > 400;
      }
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      setPastHero((prev) => (prev === nextPastHero ? prev : nextPastHero));
    };

    if (lenis) {
      onScroll(lenis.scroll);
      const unsub = lenis.on("scroll", ({ scroll }) => onScroll(scroll));
      return () => unsub();
    }

    const onWindowScroll = () => onScroll(window.scrollY);
    onWindowScroll();
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [lenis, pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const onCinematic = isCinematicPage && !pastHero;
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <header
        className={cn(
          "nav-bar",
          onCinematic && "nav-bar--cinematic",
          onCinematic && scrolled && "nav-bar--cinematic-solid",
          !onCinematic && scrolled && "nav-bar--solid",
          !onCinematic && !scrolled && "nav-bar--top",
          isDark && "nav-bar--dark"
        )}
        data-nav-mode={onCinematic ? "cinematic" : scrolled ? "solid" : "top"}
      >
        <div className="nav-bar__inner container">
          <Link href="/" className="nav-bar__logo">
            <span>eRide</span>
            <span className="nav-bar__logo-muted">Bavaria</span>
          </Link>

          <div className="nav-bar__end">
            <nav className="nav-bar__links hidden lg:flex" aria-label="Hauptnavigation">
              {mainNav.map((link) => {
                const hrefBase = link.href.split("?")[0];
                const active = pathname === link.href || pathname.startsWith(hrefBase);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn("nav-bar__link", active && "nav-bar__link--active")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <span className="nav-bar__divider hidden lg:block" aria-hidden="true" />

            <div className="nav-bar__actions">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="nav-bar__icon"
                aria-label="Suche"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <Link
                href={session ? (session.role === "ADMIN" || session.role === "EMPLOYEE" ? "/admin" : "/portal") : "/login"}
                className="nav-bar__icon hidden sm:flex"
                aria-label={session ? "Mein Konto" : accountNav.label}
                title={session ? `${session.firstName ?? session.email}` : accountNav.label}
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="nav-bar__icon relative"
                aria-label="Warenkorb"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {cartCount > 0 && <span className="nav-bar__badge">{cartCount}</span>}
              </button>
              <button
                type="button"
                className="nav-bar__menu lg:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
              >
                <span className={mobileOpen ? "open" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <button
            type="button"
            className={cn("nav-mobile-backdrop lg:hidden", onCinematic && "nav-mobile-backdrop--cinematic")}
            aria-label="Menü schließen"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className={cn("nav-mobile lg:hidden", isDark && "nav-mobile--dark", onCinematic && "nav-mobile--cinematic")}
          >
            <div className="container py-4">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-mobile__link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={session ? (session.role === "ADMIN" || session.role === "EMPLOYEE" ? "/admin" : "/portal") : "/login"}
                className="nav-mobile__link"
                onClick={() => setMobileOpen(false)}
              >
                {session ? "Mein Konto" : accountNav.label}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
