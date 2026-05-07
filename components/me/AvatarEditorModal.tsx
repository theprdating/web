"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Avatar from "./Avatar";
import type { Avatar as AvatarType } from "@/lib/store";
import {
  AVATAR_BASES, AVATAR_HATS, AVATAR_HOLDINGS, AVATAR_SCARVES, AVATAR_BGS,
} from "@/lib/avatar-data";
import clsx from "clsx";

type Tab = "base" | "bg" | "hat" | "holding" | "scarf" | "extras";
const TABS: { id: Tab; label: string }[] = [
  { id: "base", label: "顏色" },
  { id: "bg", label: "背景" },
  { id: "hat", label: "帽子" },
  { id: "holding", label: "持物" },
  { id: "scarf", label: "圍巾" },
  { id: "extras", label: "配件" },
];

export default function AvatarEditorModal({
  open, onClose, initial, onSave,
}: {
  open: boolean; onClose: () => void; initial: AvatarType;
  onSave: (next: AvatarType) => void;
}) {
  const [draft, setDraft] = useState<AvatarType>(initial);
  const [tab, setTab] = useState<Tab>("base");

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut mb-3">打扮你的角色</h3>

      <div className="bg-parchment rounded-2xl py-4">
        <Avatar avatar={draft} size={200} />
      </div>

      <div className="flex gap-1 mt-4 overflow-x-auto -mx-1 px-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={clsx("px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
              tab === t.id ? "bg-sage text-cream" : "bg-tag/20 text-walnut")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 max-h-[200px] overflow-y-auto">
        {tab === "base" && (
          <div className="grid grid-cols-3 gap-2">
            {AVATAR_BASES.map((b) => (
              <button key={b.id} onClick={() => setDraft({ ...draft, base: b.id })}
                className={clsx("p-3 rounded-xl border text-sm",
                  draft.base === b.id ? "border-sage bg-sage/10" : "border-tag/30")}>
                {b.label}
              </button>
            ))}
          </div>
        )}
        {tab === "bg" && (
          <OptionGrid options={AVATAR_BGS} value={draft.bg}
            onChange={(v) => setDraft({ ...draft, bg: v })} clearable />
        )}
        {tab === "hat" && (
          <OptionGrid options={AVATAR_HATS} value={draft.hat}
            onChange={(v) => setDraft({ ...draft, hat: v })} clearable />
        )}
        {tab === "holding" && (
          <OptionGrid options={AVATAR_HOLDINGS} value={draft.holding}
            onChange={(v) => setDraft({ ...draft, holding: v })} clearable />
        )}
        {tab === "scarf" && (
          <OptionGrid options={AVATAR_SCARVES} value={draft.scarf}
            onChange={(v) => setDraft({ ...draft, scarf: v })} clearable />
        )}
        {tab === "extras" && (
          <div className="space-y-2">
            <Toggle label="圓框眼鏡" on={!!draft.glasses}
              onChange={(v) => setDraft({ ...draft, glasses: v || undefined })} />
            <Toggle label="書籤" on={!!draft.bookmark}
              onChange={(v) => setDraft({ ...draft, bookmark: v || undefined })} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onSave(draft); onClose(); }}>儲存</Button>
      </div>
    </Modal>
  );
}

function OptionGrid<T extends string>({ options, value, onChange, clearable }: {
  options: { id: T; label: string }[]; value?: T; onChange: (v: T | undefined) => void; clearable?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {clearable && (
        <button onClick={() => onChange(undefined)}
          className={clsx("p-3 rounded-xl border text-sm",
            !value ? "border-sage bg-sage/10" : "border-tag/30")}>
          無
        </button>
      )}
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={clsx("p-3 rounded-xl border text-sm",
            value === o.id ? "border-sage bg-sage/10" : "border-tag/30")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={clsx("w-full p-3 rounded-xl border text-sm flex justify-between items-center",
        on ? "border-sage bg-sage/10" : "border-tag/30")}>
      <span>{label}</span>
      <span className="text-walnut-soft text-xs">{on ? "開啟" : "關閉"}</span>
    </button>
  );
}
