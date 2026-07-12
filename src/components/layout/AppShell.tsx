"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { usePathname } from "next/navigation";
import { StoreProvider } from "@/lib/store";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShowroom = pathname.startsWith("/product/");

  return (
    <StoreProvider>
      <SmoothScrollProvider>
        <SearchOverlay />
        <CartDrawer />
        {!isShowroom && <Navigation />}
        {children}
        {!isShowroom && <Footer />}
        <CookieBanner />
      </SmoothScrollProvider>
    </StoreProvider>
  );
}
