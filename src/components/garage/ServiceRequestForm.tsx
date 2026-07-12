"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ServiceRequestForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [problem, setProblem] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setEmail(d.user.email);
          const fullName = [d.user.firstName, d.user.lastName].filter(Boolean).join(" ");
          if (fullName) setName(fullName);
        }
      })
      .catch(() => {});
  }, []);

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
    if (!email.trim() || problem.trim().length < 10) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          productName: productName || undefined,
          problemDescription: problem,
          images,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setProblem("");
      setImages([]);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card/40 p-8">
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

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          Fahrzeug
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="z. B. EEC Star 6.0"
          className="consultation__input"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          Problembeschreibung *
        </label>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Beschreiben Sie das Problem so genau wie möglich …"
          rows={4}
          className="consultation__textarea"
        />
      </div>

      <div>
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
          {images.length >= 3 ? "Maximum erreicht" : "Fotos des Problems anhängen (max. 3)"}
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

      <Button
        onClick={submit}
        disabled={status === "loading" || !email.trim() || problem.trim().length < 10}
        className="!bg-accent !text-white hover:!opacity-90"
      >
        {status === "loading"
          ? "Wird gesendet …"
          : status === "success"
            ? "Anfrage gesendet"
            : "Serviceanfrage senden"}
      </Button>

      {status === "error" && (
        <p className="text-small text-red-600">
          Senden fehlgeschlagen. Bitte versuchen Sie es erneut.
        </p>
      )}
    </div>
  );
}
