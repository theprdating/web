export default function ProgressCard({ a, b }: {
  a: { name: string; percent: number };
  b: { name: string; percent: number };
}) {
  return (
    <div className="bg-cream rounded-2xl p-4 border border-tag/30 grid grid-cols-2 gap-3">
      <Side {...a} />
      <Side {...b} />
    </div>
  );
}

function Side({ name, percent }: { name: string; percent: number }) {
  return (
    <div>
      <div className="text-walnut-soft text-xs">{name}</div>
      <div className="font-display text-3xl text-sage mt-1">{percent}%</div>
      <div className="h-1.5 bg-tag/30 rounded-full mt-2 overflow-hidden">
        <div className="h-full bg-sage transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
