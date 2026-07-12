import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsultationField } from "@/components/commerce/ConsultationField";
import Link from "next/link";
import { getAllProducts, getSpareParts } from "@/lib/catalog";
import { formatPrice } from "@/lib/products";

export default async function PartsPage() {
  const [products, parts] = await Promise.all([getAllProducts(), getSpareParts()]);

  return (
    <main className="pt-28">
      <section className="section">
        <Container>
          <SectionHeading
            label="Ersatzteile"
            title="Originalteile für Ihr Fahrzeug"
            description="Wählen Sie Ihr Modell und finden Sie kompatible Ersatzteile — oder senden Sie uns ein Foto zur Identifikation."
          />

          {parts.length > 0 && (
            <div className="mt-12">
              <h2 className="heading-md mb-6">Verfügbare Ersatzteile</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parts.map((part) => (
                  <div
                    key={part.id}
                    className="rounded-[12px] border border-border bg-card-elevated p-6"
                  >
                    <p className="font-mono text-xs text-muted">{part.partNumber}</p>
                    <h3 className="mt-2 font-medium">{part.name}</h3>
                    <p className="mt-2 text-sm text-foreground-secondary">
                      {part.description}
                    </p>
                    <p className="mt-4 font-medium">{formatPrice(part.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}#parts`}
                className="rounded-[12px] border border-border bg-card-elevated p-6 transition-colors hover:border-foreground/15"
              >
                <p className="text-small text-muted">{p.brand}</p>
                <h3 className="mt-2 font-medium">{p.name}</h3>
                <p className="mt-2 text-small text-muted">Ersatzteile anzeigen →</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <ConsultationField
        title="Teil nicht gefunden?"
        description="Laden Sie ein Foto hoch oder beschreiben Sie das Teil — wir identifizieren es und senden ein Angebot."
      />
    </main>
  );
}
