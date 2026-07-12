"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LoadingScreen } from "@/components/providers/LoadingScreen";
import { CustomCursor } from "@/components/providers/CustomCursor";
import { StoreProvider } from "@/lib/store";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <StoreProvider>
      <SmoothScrollProvider>
        {isHome && <LoadingScreen />}
        <CustomCursor />
        <div className="noise-overlay" />
        <SearchOverlay />
        <CartDrawer />
        <Navigation />
        {children}
        <Footer />
      </SmoothScrollProvider>
    </StoreProvider>
  );
}
