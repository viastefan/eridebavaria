import type { Metadata } from "next";
import { CompareTable } from "@/components/commerce/CompareTable";

export const metadata: Metadata = {
  title: "Compare Vehicles — eRide Bavaria",
  description: "Compare up to 4 electric vehicles side by side.",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen pt-32 pb-24 section-padding">
      <CompareTable />
    </main>
  );
}
