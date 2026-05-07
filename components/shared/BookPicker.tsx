"use client";
import { useState } from "react";
import { useFolioStore } from "@/lib/store";
import Input from "@/components/ui/Input";

export default function BookPicker({ value, onChange }: { value: string; onChange: (bookId: string) => void; }) {
  const books = useFolioStore((s) => s.books);
  const upsertBook = useFolioStore((s) => s.upsertBook);
  const [custom, setCustom] = useState("");

  const addCustom = () => {
    const t = custom.trim();
    if (!t) return;
    const id = `b-${Date.now()}`;
    upsertBook({ id, title: t });
    onChange(id);
    setCustom("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.values(books).map((b) => (
          <button key={b.id} onClick={() => onChange(b.id)}
            className={`px-3 py-1.5 rounded-full text-sm border ${value === b.id ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut"}`}>
            {b.title}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="或輸入書名" />
        <button onClick={addCustom} className="px-4 rounded-xl border border-tag/40 text-sage">＋</button>
      </div>
    </div>
  );
}
