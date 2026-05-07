"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function EditFieldModal({
  open, onClose, label, initial, onSave, cooldownMessage,
}: {
  open: boolean; onClose: () => void; label: string; initial: string;
  onSave: (next: string) => void; cooldownMessage?: string;
}) {
  const [val, setVal] = useState(initial);
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut">編輯 {label}</h3>
      {cooldownMessage && <p className="text-amber-700 text-sm mt-2">⚠️ {cooldownMessage}</p>}
      <Input value={val} onChange={(e) => setVal(e.target.value)} className="mt-4" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onSave(val); onClose(); }}>儲存</Button>
      </div>
    </Modal>
  );
}
