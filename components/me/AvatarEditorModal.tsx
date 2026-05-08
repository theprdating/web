"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AvatarEditorBody from "./AvatarEditorBody";
import type { Avatar as AvatarType } from "@/lib/store";

export default function AvatarEditorModal({
  open, onClose, initial, onSave,
}: {
  open: boolean; onClose: () => void; initial: AvatarType;
  onSave: (next: AvatarType) => void;
}) {
  const [draft, setDraft] = useState<AvatarType>(initial);

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut mb-3">打扮你的角色</h3>
      <AvatarEditorBody value={draft} onChange={setDraft} />
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onSave(draft); onClose(); }}>儲存</Button>
      </div>
    </Modal>
  );
}
