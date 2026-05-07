"use client";
import { useEffect } from "react";
import { hydrateFromStorage } from "@/lib/store";

export default function StoreHydrator() {
  useEffect(() => { hydrateFromStorage(); }, []);
  return null;
}
