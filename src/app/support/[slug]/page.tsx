import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug, products } from "@/lib/products";
import {
  FileText,
  Video,
  HelpCircle,
  Wrench,
  Download,
  Shield,
  MessageCircle,
} from "lucide-react";
import { labels, supportSections } from "@/lib/labels";

interface Props {
  params: Promise<{ slug: string }>;
}

const supportIcons = [
  FileText,
  Video,
  HelpCircle,
  Wrench,
  Download,
  Shield,
  MessageCircle,
];

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Nicht gefunden" };
  return {
    title: `${product.name} — Support`,
    description: `Support, Handbücher und Ressourcen für das ${product.name}.`,
  };
}

export default async function SupportPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-4xl">
        <nav className="mb-8 text-xs text-foreground-secondary">
          <Link href="/account" className="hover:text-foreground">
            {labels.account}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/product/${product.slug}`} className="hover:text-foreground">
            {product.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Support</span>
        </nav>

        <h1 className="heading-xl">{product.name}</h1>
        <p className="mt-2 text-lg text-foreground-secondary">
          Alles, was du brauchst, um das Beste aus deinem Fahrzeug herauszuholen.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {supportSections.map((section, i) => {
            const Icon = supportIcons[i];
            return (
              <Link
                key={section.title}
                href="#"
                className="group flex items-start gap-4 rounded-2xl border border-border p-6 transition-colors hover:bg-card"
                data-cursor="pointer"
              >
                <div className="rounded-xl bg-card p-3 transition-colors group-hover:bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="mt-1 text-sm text-foreground-secondary">
                    {section.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card/30 p-8 text-center">
          <h2 className="text-lg font-medium">{labels.needHelp}</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            {labels.supportHours}
          </p>
          <button
            className="mt-6 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-all hover:shadow-[0_0_30px_rgba(59,158,255,0.25)]"
            data-cursor="pointer"
          >
            {labels.contactSupport}
          </button>
        </div>
      </div>
    </main>
  );
}
