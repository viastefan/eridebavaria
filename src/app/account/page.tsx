"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  FileText,
  Shield,
  Download,
  Heart,
  Wrench,
  Car,
  MessageCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { products, formatPrice } from "@/lib/products";

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "warranty", label: "Warranty", icon: Shield },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "parts", label: "Replacement Parts", icon: Wrench },
  { id: "vehicles", label: "My Vehicles", icon: Car },
  { id: "support", label: "Support", icon: MessageCircle },
];

const mockOrders = [
  {
    id: "ER-2026-0042",
    date: "Mar 8, 2026",
    product: "Volt X1",
    status: "In Transit",
    total: 24990,
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { wishlist } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-xl">Account</h1>
          <p className="mt-2 text-foreground-secondary">
            Welcome back. Manage your vehicles and orders.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="flex gap-2 overflow-x-auto hide-scrollbar lg:flex-col lg:gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-card text-foreground"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
                data-cursor="pointer"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="rounded-2xl border border-border bg-card/30 p-8">
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Recent Orders</h2>
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border border-border p-6"
                  >
                    <div>
                      <span className="font-medium">{order.product}</span>
                      <span className="mt-1 block text-sm text-foreground-secondary">
                        {order.id} · {order.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-accent">{order.status}</span>
                      <span className="mt-1 block text-sm">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="mb-6 text-lg font-medium">Wishlist</h2>
                {wishlistProducts.length === 0 ? (
                  <p className="text-foreground-secondary">
                    No saved vehicles yet.{" "}
                    <Link href="/shop" className="text-accent hover:underline">
                      Explore collection
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {wishlistProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-card"
                      >
                        <span>{p.name}</span>
                        <span className="text-sm text-foreground-secondary">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "vehicles" && (
              <div>
                <h2 className="mb-6 text-lg font-medium">Registered Vehicles</h2>
                <Link
                  href="/support/volt-x1"
                  className="flex items-center justify-between rounded-xl border border-border p-6 transition-colors hover:bg-card"
                >
                  <div>
                    <span className="font-medium">Volt X1</span>
                    <span className="mt-1 block text-sm text-foreground-secondary">
                      VIN: EB-2026-0042 · Registered Mar 2026
                    </span>
                  </div>
                  <span className="text-accent">Support →</span>
                </Link>
              </div>
            )}

            {activeTab === "downloads" && (
              <div className="space-y-3">
                <h2 className="mb-6 text-lg font-medium">Downloads</h2>
                {[
                  "Vehicle Manual — Volt X1",
                  "Digital Warranty Certificate",
                  "Maintenance Guide",
                  "Tutorial Videos",
                ].map((doc) => (
                  <button
                    key={doc}
                    className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left text-sm transition-colors hover:bg-card"
                    data-cursor="pointer"
                  >
                    <span>{doc}</span>
                    <Download className="h-4 w-4 text-foreground-secondary" />
                  </button>
                ))}
              </div>
            )}

            {!["orders", "wishlist", "vehicles", "downloads"].includes(activeTab) && (
              <div className="py-12 text-center text-foreground-secondary">
                <p>{tabs.find((t) => t.id === activeTab)?.label} section</p>
                <p className="mt-2 text-sm">Contact support for assistance.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
