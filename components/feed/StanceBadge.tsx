import type { Stance } from "@/lib/store";
import clsx from "clsx";

const TONE: Record<Stance, string> = {
  "純粹書友":     "bg-sage/20 text-sage",
  "純粹找緣分":   "bg-amber-200/40 text-amber-800",
  "不拘":         "bg-tag/30 text-walnut",
};

export default function StanceBadge({ stance }: { stance: Stance }) {
  return <span className={clsx("text-[11px] px-2 py-0.5 rounded-full", TONE[stance])}>{stance}</span>;
}
