"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { PRESET_CATEGORIES } from "@/lib/book-categories";
import clsx from "clsx";

export default function EditCategoriesModal({ open, onClose, initial, onSave }:
  { open: boolean; onClose: () => void; initial: string[]; onSave: (cs: string[]) => void; }
) {
  const [cats, setCats] = useState<string[]>(initial);
  const [custom, setCustom] = useState("");
  const toggle = (c: string) => setCats((cs) =>
    cs.includes(c) ? cs.filter((x) => x !== c) : (cs.length >= 5 ? cs : [...cs, c])
  );
  const addCustom = () => {
    const t = custom.trim();
    if (!t || cats.length >= 5 || cats.includes(t)) return;
    setCats([...cats, t]); setCustom("");
  };
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut">編輯書籍種類</h3>
      <div className="flex flex-wrap gap-2 mt-3">
        {PRESET_CATEGORIES.map((c) => (
          <button key={c} onClick={() => toggle(c)}
            className={clsx("px-3 py-1.5 rounded-full border text-sm",
              cats.includes(c) ? "border-sage bg-sage text-cream" : "border-tag/40")}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="自訂類別" />
        <button onClick={addCustom} className="px-4 rounded-xl border border-tag/40 text-sage">＋</button>
      </div>
      <p className="text-xs text-walnut-soft mt-2">已選 {cats.length} / 5</p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onSave(cats); onClose(); }}>儲存</Button>
      </div>
    </Modal>
  );
}
