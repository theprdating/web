import type { Stance } from "./store";

export function canSeeEachOther(a: Stance, b: Stance): boolean {
  if (a === "不拘" || b === "不拘") return true;
  return a === b;
}
