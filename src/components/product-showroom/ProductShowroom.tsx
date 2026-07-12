"use client";

import type { Product } from "@/lib/types";
import { ShowroomProvider } from "./ShowroomProvider";
import { ShowroomChrome } from "./ShowroomChrome";
import { ShowroomHero } from "./ShowroomHero";
import { ConsultationField } from "@/components/commerce/ConsultationField";
import { ShowroomConfigurator } from "./ShowroomConfigurator";
import { ShowroomAccessories } from "./ShowroomAccessories";
import { ShowroomParts } from "./ShowroomParts";
import { ShowroomCompare } from "./ShowroomCompare";
import { ShowroomTechnology } from "./ShowroomTechnology";
import { ShowroomMedia } from "./ShowroomMedia";
import { ShowroomStory } from "./ShowroomStory";
import { ShowroomDNA } from "./ShowroomDNA";

export function ProductShowroom({ product }: { product: Product }) {
  return (
    <ShowroomProvider product={product}>
      <main className="showroom-page bg-background">
        <ShowroomChrome />
        <ShowroomHero />
        <ShowroomConfigurator />
        <ShowroomDNA />
        <ShowroomAccessories />
        <ShowroomParts />
        <ShowroomCompare />
        <ShowroomTechnology />
        <ShowroomMedia />
        <ShowroomStory />
        <ConsultationField
          productName={product.name}
          productId={product.id}
          title="Wie soll dieses Fahrzeug zu Ihnen passen?"
          description="Beschreiben Sie Ihren Einsatz, Ihre Anforderungen und gewünschte Anpassungen — wir erstellen eine individuelle Mobilitätslösung und melden uns persönlich."
        />
      </main>
    </ShowroomProvider>
  );
}
