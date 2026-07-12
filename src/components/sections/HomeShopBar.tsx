import Link from "next/link";
import { Building2, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { commerceCopy } from "@/lib/commerce-copy";

export function HomeShopBar() {
  const { shopBar } = commerceCopy.home;

  return (
    <section className="shop-bar border-y border-border bg-surface">
      <Container className="py-8 md:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div className="flex gap-4">
            <div className="shop-bar__icon" aria-hidden>
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="eyebrow">Online-Katalog</p>
              <h2 className="heading-md mt-2 text-foreground">{shopBar.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-secondary">
                {shopBar.text}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn--primary">
              {shopBar.cta}
            </Link>
            <Link href={commerceCopy.shop.fleetHref} className="btn btn--secondary inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" strokeWidth={1.5} />
              {shopBar.secondary}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
