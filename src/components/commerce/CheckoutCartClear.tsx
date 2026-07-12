"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function CheckoutCartClear() {
  const { syncCart } = useStore();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  return null;
}
