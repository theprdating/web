"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Button from "@/components/ui/Button";
import { STANCE_META } from "@/lib/stance-meta";
import type { Stance } from "@/lib/store";
import clsx from "clsx";

export default function StancePage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [stance, setStance] = useState<Stance>(user?.stance ?? "純粹書友");

  const next = () => {
    if (!user) return;
    upsertUser({ ...user, stance, stanceChangedAt: Date.now() });
    router.push("/register/confirm");
  };

  return (
    <>
      <RegisterStepper current={2} />
      <h1 className="font-display text-3xl text-walnut mb-2">你抱持的心態</h1>
      <p className="text-walnut-soft text-sm mb-6">這會決定你看到誰、誰看到你。之後可改、有 7 天冷卻。</p>

      <div className="space-y-3">
        {(Object.entries(STANCE_META) as [Stance, typeof STANCE_META[Stance]][]).map(([key, m]) => (
          <button key={key} onClick={() => setStance(key)} className={clsx(
            "w-full text-left p-5 rounded-2xl border-2 transition-colors",
            stance === key ? "border-sage bg-sage/10" : "border-tag/30 bg-cream")}>
            <div className="font-medium text-walnut">{m.label}</div>
            <div className="text-walnut-soft text-sm mt-1">{m.sub}</div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={next}>下一步</Button>
      </div>
    </>
  );
}
