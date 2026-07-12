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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.name} Support — eRide Bavaria`,
    description: `Support, manuals, and resources for ${product.name}.`,
  };
}

const supportSections = [
  { icon: FileText, title: "Owner's Manual", description: "Complete operating guide", href: "#" },
  { icon: Video, title: "Tutorial Videos", description: "Step-by-step walkthroughs", href: "#" },
  { icon: HelpCircle, title: "FAQ", description: "Common questions answered", href: "#" },
  { icon: Wrench, title: "Replacement Parts", description: "Genuine components", href: "#" },
  { icon: Download, title: "Downloads", description: "Software & documents", href: "#" },
  { icon: Shield, title: "Warranty", description: "Coverage & claims", href: "#" },
  { icon: MessageCircle, title: "Service Request", description: "Book a service appointment", href: "#" },
];

export default async function SupportPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-4xl">
        <nav className="mb-8 text-xs text-foreground-secondary">
          <Link href="/account" className="hover:text-foreground">
            Account
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
          Everything you need to get the most from your vehicle.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {supportSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group flex items-start gap-4 rounded-2xl border border-border p-6 transition-colors hover:bg-card"
              data-cursor="pointer"
            >
              <div className="rounded-xl bg-card p-3 transition-colors group-hover:bg-accent/10">
                <section.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card/30 p-8 text-center">
          <h2 className="text-lg font-medium">Need more help?</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Our European support team is available Mon–Fri, 9:00–18:00 CET.
          </p>
          <button
            className="mt-6 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-all hover:shadow-[0_0_30px_rgba(59,158,255,0.25)]"
            data-cursor="pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
}
