import clsx from "clsx";

export default function PageDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={clsx("w-2 h-2 rounded-full transition-colors",
          i === current ? "bg-sage" : "bg-tag/40")} />
      ))}
    </div>
  );
}
