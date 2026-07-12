import Link from "next/link";
import { platform } from "@/lib/platform";
import { regional } from "@/lib/regional";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Container } from "@/components/ui/Container";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Fahrzeuge: [
    { label: "Alle Modelle", href: "/shop" },
    { label: "Angebote", href: "/shop" },
    { label: "Zubehör", href: "/shop?category=zubehoer" },
  ],
  Service: [
    { label: "Ersatzteile", href: "/parts" },
    { label: "Werkstatt", href: "/garage" },
    { label: "Garantie", href: "/garage" },
    { label: "Beratung", href: "/shop" },
  ],
  Unternehmen: [
    { label: "Journal", href: "/journal" },
    { label: "Gewerbe", href: "/fleet" },
    { label: "Meine Garage", href: "/garage" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm font-medium tracking-tight">eRide</span>
              <span className="text-sm font-normal text-foreground-secondary">Bavaria</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-foreground-secondary">
              {platform.brand.manifesto}
            </p>
            <p className="mt-6 text-sm text-foreground-secondary">
              {regional.brand.postal} {regional.brand.city}
              <br />
              {regional.brand.region}
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground-secondary">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-foreground-secondary transition-colors duration-500 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:mt-20 md:flex-row">
          <p className="text-xs text-foreground-secondary">
            © 2026 eRide Bavaria · {regional.brand.city}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <ThemeToggle variant="footer" />
            <Link href="#" className="text-xs text-foreground-secondary hover:text-foreground">
              Datenschutz
            </Link>
            <Link href="#" className="text-xs text-foreground-secondary hover:text-foreground">
              AGB
            </Link>
            <Link href="#" className="text-xs text-foreground-secondary hover:text-foreground">
              Impressum
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
