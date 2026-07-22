"use client";

import { Navigation } from "@/components/layout/Navigation";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
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
        <div className="app-shell">
          <SearchOverlay />
          <CartDrawer />
          {!isShowroom && <Navigation />}
          <div className="app-shell__content">{children}</div>
          {!isShowroom && <Footer />}
          {!isShowroom && <MobileBottomNav />}
          <CookieBanner />
        </div>
      </SmoothScrollProvider>
    </StoreProvider>
  );
}
