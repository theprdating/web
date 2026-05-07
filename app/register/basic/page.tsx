"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import { PRESET_CATEGORIES } from "@/lib/book-categories";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import clsx from "clsx";

export default function BasicPage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const upsertUser = useFolioStore((s) => s.upsertUser);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [age, setAge] = useState(user?.age || 0);
  const [categories, setCategories] = useState<string[]>(user?.bookCategories ?? []);
  const [customCat, setCustomCat] = useState("");

  const toggleCat = (c: string) => {
    setCategories((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : (cs.length >= 5 ? cs : [...cs, c]));
  };

  const addCustom = () => {
    const trimmed = customCat.trim();
    if (!trimmed || categories.length >= 5 || categories.includes(trimmed)) return;
    setCategories([...categories, trimmed]);
    setCustomCat("");
  };

  const valid = nickname.trim() && gender && age > 0 && categories.length > 0;

  const next = () => {
    if (!user || !valid) return;
    upsertUser({ ...user, nickname: nickname.trim(), gender, age, bookCategories: categories });
    router.push("/register/qa");
  };

  return (
    <>
      <RegisterStepper current={0} />
      <h1 className="font-display text-3xl text-walnut mb-6">先讓我們認識你</h1>

      <label className="text-walnut-soft text-sm">暱稱</label>
      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mb-5 mt-1" />

      <label className="text-walnut-soft text-sm">性別</label>
      <div className="grid grid-cols-3 gap-2 my-2 mb-5">
        {["女","男","其他"].map((g) => (
          <button key={g} onClick={() => setGender(g)} className={clsx(
            "py-3 rounded-xl border transition-colors",
            gender === g ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut")}>{g}</button>
        ))}
      </div>

      <label className="text-walnut-soft text-sm">年齡</label>
      <Input type="number" min={1} max={120} value={age || ""} onChange={(e) => setAge(parseInt(e.target.value || "0"))} className="mb-5 mt-1" />

      <label className="text-walnut-soft text-sm">喜歡的書籍種類（最多 5 個）</label>
      <div className="flex flex-wrap gap-2 my-2">
        {PRESET_CATEGORIES.map((c) => (
          <button key={c} onClick={() => toggleCat(c)} className={clsx(
            "px-3 py-1.5 rounded-full border text-sm transition-colors",
            categories.includes(c) ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut")}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        <Input value={customCat} onChange={(e) => setCustomCat(e.target.value)} placeholder="自訂類別" />
        <button onClick={addCustom} className="px-4 rounded-xl border border-tag/40 text-sage">＋</button>
      </div>
      <p className="text-xs text-walnut-soft -mt-6 mb-6">已選 {categories.length} / 5</p>

      <Button onClick={next} disabled={!valid}>下一步</Button>
    </>
  );
}
