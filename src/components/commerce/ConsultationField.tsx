"use client";

import { useRef, useState } from "react";
import { Clock, ShieldCheck, MessageCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface ConsultationFieldProps {
  title?: string;
  description?: string;
  productName?: string;
  productId?: string;
  className?: string;
}

export function ConsultationField({
  title = "Wir sind gern für Sie da.",
  description = "Schreiben Sie uns, wofür Sie das Fahrzeug brauchen — wir melden uns persönlich, besprechen alles in Ruhe und erstellen Ihnen ein passendes Angebot. Unverbindlich.",
  productName,
  productId,
  className = "",
}: ConsultationFieldProps) {
  const [usage, setUsage] = useState("");
  const [requirements, setRequirements] = useState("");
  const [modifications, setModifications] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 3 - images.length)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImages((prev) => [...prev, reader.result as string].slice(0, 3));
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const submit = async () => {
    const hasContent = usage.trim() || requirements.trim() || modifications.trim();
    if (!hasContent || !email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          phone: phone || undefined,
          usage: usage.trim() || undefined,
          requirements: requirements.trim() || undefined,
          modifications: modifications.trim() || undefined,
          images,
          productName,
          productId,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setUsage("");
      setRequirements("");
      setModifications("");
      setImages([]);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="beratung" className={`porsche-section ${className}`}>
      <Container>
        <div className="consultation consultation--porsche">
          <div className="consultation__header">
            <h2 className="porsche-headline porsche-headline--sm">{title}</h2>
            <p className="porsche-subline mt-4 max-w-lg">{description}</p>
            <div className="consultation-trust">
              <span className="consultation-trust__item">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                Antwort in 24h
              </span>
              <span className="consultation-trust__item">
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                Persönliche Beratung
              </span>
              <span className="consultation-trust__item">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                Unverbindlich
              </span>
            </div>
          </div>

          <div className="consultation__form">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ihr Name"
                  className="consultation__input"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                  E-Mail *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ihre E-Mail-Adresse"
                  className="consultation__input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional — für schnellere Rückmeldung"
                className="consultation__input"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                Einsatz *
              </label>
              <textarea
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="z. B. Ich brauche das Fahrzeug für ein großes Grundstück / Hof / Betrieb …"
                rows={2}
                className="consultation__textarea"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                Anforderungen
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="z. B. Zusätzlicher Stauraum, Reichweite 60 km, Winterpaket …"
                rows={2}
                className="consultation__textarea"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                Anpassungswünsche
              </label>
              <textarea
                value={modifications}
                onChange={(e) => setModifications(e.target.value)}
                placeholder="z. B. Stärkere Beleuchtung, Anhängerkupplung, Offroad-Reifen …"
                rows={2}
                className="consultation__textarea"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
                Bilder hochladen
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImages(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={images.length >= 3}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
              >
                <Upload className="h-4 w-4" />
                {images.length >= 3 ? "Maximum erreicht" : "Bilder Ihres Einsatzes anhängen (max. 3)"}
              </button>
              {images.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="consultation__footer mt-6">
              <p className="text-small text-muted">
                Persönliche Rückmeldung innerhalb von 24 Stunden.
              </p>
              <Button
                onClick={submit}
                disabled={
                  status === "loading" ||
                  !email.trim() ||
                  (!usage.trim() && !requirements.trim() && !modifications.trim())
                }
                className="!bg-accent !text-white hover:!opacity-90"
              >
                {status === "loading"
                  ? "Wird gesendet …"
                  : status === "success"
                    ? "Anfrage gesendet"
                    : "Beratung anfragen"}
              </Button>
            </div>
            {status === "error" && (
              <p className="mt-3 text-small text-red-600">
                Senden fehlgeschlagen. Bitte versuchen Sie es erneut.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
