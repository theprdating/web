import clsx from "clsx";
const STEPS = ["基本", "問答", "心態", "角色", "確認"];
export default function RegisterStepper({ current }: { current: 0|1|2|3|4 }) {
  return (
    <div className="flex items-center gap-2 text-xs text-walnut-soft mb-8 flex-wrap">
      {STEPS.map((s, i) => (
        <span key={s} className={clsx("flex items-center gap-2", i === current && "text-sage font-medium")}>
          <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center",
            i === current ? "bg-sage text-cream" : "bg-tag/30")}>{i+1}</span>
          {s}
          {i < STEPS.length - 1 && <span className="text-tag">→</span>}
        </span>
      ))}
    </div>
  );
}
