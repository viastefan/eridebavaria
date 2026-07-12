import { CheckCircle2, Package, RotateCcw, ShieldCheck } from "lucide-react";

const items = [
  { icon: Package, label: "Kostenlose Beratung", sub: "Persönlich aus Simbach" },
  { icon: RotateCcw, label: "30 Tage", sub: "Rückgaberecht" },
  { icon: ShieldCheck, label: "Offizielle Produkte", sub: "Direkt vom Partner" },
  { icon: CheckCircle2, label: "Sichere Anfrage", sub: "Datenschutz garantiert" },
];

export function ShopTrustStrip() {
  return (
    <section className="shop-trust-strip" aria-label="Service-Versprechen">
      <div className="shop-trust-strip__grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="shop-trust-strip__item">
              <Icon className="shop-trust-strip__icon" strokeWidth={1.25} />
              <div>
                <p className="shop-trust-strip__label">{item.label}</p>
                <p className="shop-trust-strip__sub">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
