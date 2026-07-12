import { Hero } from "@/components/hero/Hero";
import { HomePromoGrid } from "@/components/sections/HomePromoGrid";
import { HomeModelUniverse } from "@/components/sections/HomeModelUniverse";
import { HomeFinderTeaser } from "@/components/sections/HomeFinderTeaser";
import { HomeHighlights } from "@/components/sections/HomeHighlights";
import { HomeAccessories } from "@/components/sections/HomeAccessories";
import { ConsultationField } from "@/components/commerce/ConsultationField";
import { RegionalTrust } from "@/components/sections/RegionalTrust";
import { JournalPreview } from "@/components/sections/JournalPreview";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <HomePromoGrid />
      <HomeModelUniverse />
      <HomeFinderTeaser />
      <HomeHighlights />
      <HomeAccessories />
      <ConsultationField />
      <RegionalTrust />
      <JournalPreview />
    </main>
  );
}
