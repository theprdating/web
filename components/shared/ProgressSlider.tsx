"use client";
export default function ProgressSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-sage" />
        <span className="font-display text-2xl text-sage w-14 text-right">{value}%</span>
      </div>
    </div>
  );
}
