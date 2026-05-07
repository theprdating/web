"use client";
import { useEffect } from "react";
import { hydrateFromStorage } from "@/lib/store";
import { seedIfEmpty } from "@/lib/mock-data";

export default function StoreHydrator() {
  useEffect(() => {
    hydrateFromStorage();
    seedIfEmpty();
  }, []);
  return null;
}
