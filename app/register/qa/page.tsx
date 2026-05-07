"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import clsx from "clsx";

const HOURS = ["<1", "1-3", "3-7", "7-14", "14+"] as const;

export default function QAPage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [defining,    setDefining]    = useState(user?.qaAnswers.defining ?? "");
  const [titleOfLife, setTitleOfLife] = useState(user?.qaAnswers.titleOfMyLife ?? "");
  const [hours,       setHours]       = useState(user?.qaAnswers.readingHours);

  const answeredCount =
    (defining.trim() ? 1 : 0) + (titleOfLife.trim() ? 1 : 0) + (hours ? 1 : 0);
  const valid = answeredCount >= 1;

  const save = (skipAll = false) => {
    if (!user) return;
    upsertUser({
      ...user,
      qaAnswers: skipAll ? {} : {
        defining: defining.trim() || undefined,
        titleOfMyLife: titleOfLife.trim() || undefined,
        readingHours: hours,
      },
    });
    router.push("/register/stance");
  };

  return (
    <>
      <RegisterStepper current={1} />
      <h1 className="font-display text-3xl text-walnut mb-2">關於你和書</h1>
      <p className="text-walnut-soft text-sm mb-6">至少答 1 題，最多答 3 題；可以全跳過、之後在我的頁面補。</p>

      <label className="text-walnut text-sm">哪一本書最能形容你自己，為什麼？</label>
      <Textarea value={defining} onChange={(e) => setDefining(e.target.value)} className="mb-5 mt-1" />

      <label className="text-walnut text-sm">如果你的人生是一本書，書名會叫什麼？</label>
      <Input value={titleOfLife} onChange={(e) => setTitleOfLife(e.target.value)} className="mb-5 mt-1" />

      <label className="text-walnut text-sm">每週花多少時間在看書？</label>
      <div className="grid grid-cols-5 gap-2 mt-2 mb-8">
        {HOURS.map((h) => (
          <button key={h} onClick={() => setHours(hours === h ? undefined : h)} className={clsx(
            "py-2 rounded-xl border text-sm transition-colors",
            hours === h ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut")}>{h}</button>
        ))}
      </div>

      <div className="space-y-3">
        <Button onClick={() => save(false)} disabled={!valid}>下一步</Button>
        <Button variant="ghost" onClick={() => save(true)}>全部跳過</Button>
      </div>
    </>
  );
}
