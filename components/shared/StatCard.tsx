type Stat = { number: string | number; label: string };

export default function StatCard({ stats }: { stats: Stat[] }) {
  return (
    <div className="bg-cream rounded-2xl p-4 mb-6 grid grid-cols-3 gap-3 border border-tag/30 shadow-sm">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-display text-2xl text-sage">{s.number}</div>
          <div className="text-walnut-soft text-xs mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
