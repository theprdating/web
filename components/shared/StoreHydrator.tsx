"use client";
import { useEffect } from "react";
import { hydrateFromStorage, useFolioStore } from "@/lib/store";
import { seedIfEmpty, seedDemoRoomsFor } from "@/lib/mock-data";

export default function StoreHydrator() {
  const currentUserId = useFolioStore((s) => s.currentUserId);

  useEffect(() => {
    hydrateFromStorage();
    seedIfEmpty();
  }, []);

  useEffect(() => {
    if (currentUserId) seedDemoRoomsFor(currentUserId);
  }, [currentUserId]);

  return null;
}
