import type { Metadata } from "next";
import { ServiceEcosystem } from "@/components/sections/ServiceEcosystem";
import { ConsultationField } from "@/components/commerce/ConsultationField";
import { ServiceRequestForm } from "@/components/garage/ServiceRequestForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Service — Wartung & Betreuung",
  description:
    "Service, Werkstatt und Ersatzteile für Ihre E-Fahrzeuge — Teil Ihrer Mobilitätslösung, nicht nur ein Nachkauf.",
};

export default function ServicePage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <Container>
        <SectionHeading
          label="Service"
          title="Betreuung ist Teil des Produkts."
          description="Wartung, Reparatur und Ersatzteile — Ihr Fahrzeug bleibt mit eRide Bavaria verbunden, auch nach dem Kauf."
        />
      </Container>

      <ServiceEcosystem />

      <section className="section-padding border-t border-border py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="heading-lg mb-2">Serviceanfrage stellen</h2>
            <p className="body-muted mb-8">
              Beschreiben Sie das Problem, laden Sie Bilder hoch — wir melden uns mit einem Terminvorschlag.
            </p>
            <ServiceRequestForm />
          </div>
        </Container>
      </section>

      <ConsultationField
        title="Noch kein Fahrzeug? Wir beraten Sie zuerst."
        description="Bevor Sie ein Fahrzeug kaufen, klären wir gemeinsam Einsatz, Konfiguration und Servicebedarf."
      />
    </main>
  );
}
