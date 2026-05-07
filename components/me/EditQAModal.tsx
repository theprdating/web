"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { ReadingMins } from "@/lib/store";
import clsx from "clsx";

const HOURS: ReadingMins[] = ["<1","1-3","3-7","7-14","14+"];

export default function EditQAModal({ open, onClose, initial, onSave }:
  { open: boolean; onClose: () => void;
    initial: { defining?: string; titleOfMyLife?: string; readingHours?: ReadingMins };
    onSave: (q: { defining?: string; titleOfMyLife?: string; readingHours?: ReadingMins }) => void; }
) {
  const [d, setD] = useState(initial.defining ?? "");
  const [t, setT] = useState(initial.titleOfMyLife ?? "");
  const [h, setH] = useState<ReadingMins | undefined>(initial.readingHours);

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut">編輯個性問答</h3>
      <p className="text-walnut-soft text-sm mt-1">三題自由增 / 改 / 清空</p>

      <label className="text-walnut text-sm mt-4 block">最能形容你的書？為什麼？</label>
      <Textarea value={d} onChange={(e) => setD(e.target.value)} className="mt-1" />

      <label className="text-walnut text-sm mt-4 block">人生若是一本書，書名？</label>
      <Input value={t} onChange={(e) => setT(e.target.value)} className="mt-1" />

      <label className="text-walnut text-sm mt-4 block">每週看書時數</label>
      <div className="grid grid-cols-5 gap-2 mt-1 mb-2">
        {HOURS.map((opt) => (
          <button key={opt} onClick={() => setH(h === opt ? undefined : opt)}
            className={clsx("py-2 rounded-xl border text-sm",
              h === opt ? "border-sage bg-sage text-cream" : "border-tag/40")}>{opt}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => onSave({ defining: d.trim() || undefined, titleOfMyLife: t.trim() || undefined, readingHours: h })}>儲存</Button>
      </div>
    </Modal>
  );
}
