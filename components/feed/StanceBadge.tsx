import type { Stance } from "@/lib/store";

export default function StanceBadge({ stance }: { stance: Stance }) {
  if (stance !== "不拘") return null;
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-tag/30 text-walnut">
      不拘
    </span>
  );
}
