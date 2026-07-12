"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";

const statuses = [
  { id: "CREATED", label: "Eingegangen" },
  { id: "REVIEWING", label: "In Prüfung" },
  { id: "APPOINTMENT", label: "Termin" },
  { id: "IN_PROGRESS", label: "In Arbeit" },
  { id: "COMPLETED", label: "Abgeschlossen" },
] as const;

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  tagline: string;
  description: string;
  price: number;
  brand: string;
  status: string;
  available: boolean;
  productType: string;
  categoryId: string;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

const emptyForm = {
  id: "",
  slug: "",
  sku: "",
  name: "",
  tagline: "",
  description: "",
  price: "",
  brand: "eRide Bavaria",
  categoryId: "kleinwagen",
  productType: "VEHICLE",
  status: "ACTIVE",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    fetch("/api/products")
      .then(() =>
        fetch("/api/admin/products")
          .then((r) => r.json())
          .then((d) => {
            const cats = new Map<string, Category>();
            (d.products ?? []).forEach((p: Product) => cats.set(p.category.id, p.category));
            setCategories(Array.from(cats.values()));
          })
      )
      .catch(() => {});
  }, []);

  const toggleAvailable = async (id: string, available: boolean) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, available: !available }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: !available } : p)));
  };

  const saveProduct = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !products.find((p) => p.id === editing.id);
    const payload = {
      ...editing,
      price: parseFloat(editing.price as unknown as string) || 0,
      images: [],
      specs: {},
      available: true,
      featured: false,
    };

    const res = await fetch("/api/admin/products", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditing(null);
      load();
    }
    setSaving(false);
  };

  const startEdit = (p: Product) => {
    setEditing({
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      price: String(p.price),
      brand: p.brand,
      categoryId: p.categoryId,
      productType: p.productType,
      status: p.status,
    });
  };

  if (loading) return <p className="text-foreground-secondary">Laden …</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-xl">Produkte</h1>
        <Button onClick={() => setEditing({ ...emptyForm, id: `new-${Date.now()}`, slug: "", sku: "" })}>
          Neues Produkt
        </Button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="heading-md">
            {products.find((p) => p.id === editing.id) ? "Produkt bearbeiten" : "Neues Produkt"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="ID" value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" disabled={!!products.find((p) => p.id === editing.id)} />
            <input placeholder="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" />
            <input placeholder="SKU" value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" />
            <input placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" />
            <input placeholder="Tagline" value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" />
            <input placeholder="Preis" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" />
            <input placeholder="Marke" value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm" />
            <select value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="kleinwagen">Elektro Kleinwagen</option>
              <option value="zubehoer">Zubehör</option>
            </select>
            <select value={editing.productType} onChange={(e) => setEditing({ ...editing, productType: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
              <option value="VEHICLE">Fahrzeug</option>
              <option value="ACCESSORY">Zubehör</option>
              <option value="PART">Ersatzteil</option>
            </select>
            <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
              <option value="ACTIVE">Aktiv</option>
              <option value="DRAFT">Entwurf</option>
              <option value="ARCHIVED">Archiviert</option>
            </select>
          </div>
          <textarea placeholder="Beschreibung" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm" />
          <div className="flex gap-3">
            <Button onClick={saveProduct} disabled={saving}>{saving ? "Speichern …" : "Speichern"}</Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>Abbrechen</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-foreground-secondary">
              <th className="p-4">Name</th>
              <th className="p-4">Kategorie</th>
              <th className="p-4">Typ</th>
              <th className="p-4">Preis</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="p-4">
                  <a href={`/product/${p.slug}`} className="hover:text-accent">{p.name}</a>
                </td>
                <td className="p-4">{p.category.name}</td>
                <td className="p-4">{p.productType}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">{p.status}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-xs text-accent hover:underline">Bearbeiten</button>
                    <button
                      onClick={() => toggleAvailable(p.id, p.available)}
                      className={`rounded-full px-3 py-1 text-xs ${p.available ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"}`}
                    >
                      {p.available ? "Aktiv" : "Inaktiv"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
