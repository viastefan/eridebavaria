"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { MegaMenu } from "@/components/commerce/MegaMenu";

const navLinks = [
  { label: "Collection", href: "/shop" },
  { label: "Technology", href: "/#technology" },
  { label: "Stories", href: "/#stories" },
  { label: "Compare", href: "/compare" },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    setSearchOpen,
    setMegaMenuOpen,
    megaMenuOpen,
    setCartOpen,
    cartCount,
    wishlist,
    compare,
  } = useStore();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaMenuOpen(false);
  }, [pathname, setMegaMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-2xl transition-all duration-700 ${
          scrolled || !isHome
            ? "glass py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent py-4"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: isHome ? 2.2 : 0, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5" data-cursor="pointer">
            <span className="text-base font-medium tracking-tight">eRide</span>
            <span className="text-base font-light text-foreground-secondary">Bavaria</span>
          </Link>

          {/* Center nav */}
          <div className="hidden items-center gap-8 lg:flex">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                megaMenuOpen ? "text-foreground" : "text-foreground-secondary hover:text-foreground"
              }`}
              data-cursor="pointer"
            >
              <Menu className="h-4 w-4" />
              Shop
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-secondary transition-colors duration-300 hover:text-foreground"
                data-cursor="pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2.5 text-foreground-secondary transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Search"
              data-cursor="pointer"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/account"
              className="hidden rounded-full p-2.5 text-foreground-secondary transition-colors hover:bg-white/5 hover:text-foreground md:block"
              data-cursor="pointer"
            >
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 && (
                <span className="sr-only">{wishlist.length} wishlisted</span>
              )}
            </Link>
            <Link
              href="/compare"
              className="relative hidden rounded-full p-2.5 text-foreground-secondary transition-colors hover:bg-white/5 hover:text-foreground md:block"
              data-cursor="pointer"
            >
              <span className="text-xs font-medium">vs</span>
              {compare.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-background">
                  {compare.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2.5 text-foreground-secondary transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Cart"
              data-cursor="pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-background">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              href="/account"
              className="hidden rounded-full p-2.5 text-foreground-secondary transition-colors hover:bg-white/5 hover:text-foreground lg:block"
              data-cursor="pointer"
            >
              <User className="h-4 w-4" />
            </Link>

            <button
              className="ml-1 flex flex-col gap-1.5 p-2 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block h-px w-5 bg-foreground transition-transform ${mobileOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-foreground transition-transform ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <MegaMenu />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-background/98 px-8 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => {
                setMegaMenuOpen(true);
                setMobileOpen(false);
              }}
              className="heading-lg text-left"
            >
              Shop
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={link.href} className="heading-lg" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <Link href="/account" className="text-foreground-secondary" onClick={() => setMobileOpen(false)}>
              Account
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
