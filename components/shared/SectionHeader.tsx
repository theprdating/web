import clsx from "clsx";

export default function SectionHeader({ label, count, className = "" }: {
  label: string; count?: number; className?: string;
}) {
  return (
    <h2 className={clsx("font-display text-walnut-soft text-sm mt-8 mb-3 flex items-center gap-2", className)}>
      <span className="w-1 h-4 bg-sage rounded-full" />
      {label}
      {typeof count === "number" && <span className="text-tag">({count})</span>}
    </h2>
  );
}
