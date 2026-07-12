import type { Metadata } from "next";
import { CompareTable } from "@/components/commerce/CompareTable";

export const metadata: Metadata = {
  title: "Fahrzeuge vergleichen",
  description: "Vergleiche bis zu 4 E-Fahrzeuge direkt nebeneinander.",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen pt-32 pb-24 section-padding">
      <CompareTable />
    </main>
  );
}
