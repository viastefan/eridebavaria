import Link from "next/link";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Shop: [
    { label: "Elektro Kleinwagen", href: "/shop?category=kleinwagen" },
    { label: "Transporter", href: "/shop?category=transporter" },
    { label: "Motorräder", href: "/shop?category=motorraeder" },
    { label: "Quads", href: "/shop?category=quads" },
    { label: "Mopedauto", href: "/shop?category=mopedauto" },
    { label: "Zubehör", href: "/shop?category=zubehoer" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "/#stories" },
    { label: "Technologie", href: "/#technology" },
    { label: "Vergleich", href: "/compare" },
    { label: "Kontakt", href: "/account" },
  ],
  Service: [
    { label: "FAQ", href: "/support/efo-em8-elektro-chopper" },
    { label: "Gewährleistung", href: "/account" },
    { label: "Ersatzteile", href: "/account" },
    { label: "Konto", href: "/account" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="section-padding py-20">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xl font-medium">eRide</span>
              <span className="text-xl font-light text-foreground-secondary">
                Bavaria
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-foreground-secondary">
              Premium E-Mobilität für Europa. Kuratiert, geprüft und persönlich
              beraten — weit entfernt vom Standard-Webshop.
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
                      className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
                      data-cursor="pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-foreground-secondary">
            © 2026 eRide Bavaria. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-xs text-foreground-secondary hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs text-foreground-secondary hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-xs text-foreground-secondary hover:text-foreground"
            >
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
