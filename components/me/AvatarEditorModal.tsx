"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Avatar from "./Avatar";
import type { Avatar as AvatarType, AvatarExpression, AvatarHeight, AvatarWeight } from "@/lib/store";
import {
  AVATAR_BASES, AVATAR_BGS,
  AVATAR_EXPRESSIONS, AVATAR_HEIGHTS, AVATAR_WEIGHTS,
} from "@/lib/avatar-data";
import clsx from "clsx";

type Tab = "base" | "bg" | "expression" | "height" | "weight";
const TABS: { id: Tab; label: string }[] = [
  { id: "base",       label: "顏色" },
  { id: "bg",         label: "背景" },
  { id: "expression", label: "表情" },
  { id: "height",     label: "身高" },
  { id: "weight",     label: "胖瘦" },
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
        {tab === "expression" && (
          <RequiredGrid
            options={AVATAR_EXPRESSIONS}
            value={draft.expression ?? "default"}
            onChange={(v) => setDraft({ ...draft, expression: v })}
          />
        )}
        {tab === "height" && (
          <RequiredGrid
            options={AVATAR_HEIGHTS}
            value={draft.height ?? "regular"}
            onChange={(v) => setDraft({ ...draft, height: v })}
          />
        )}
        {tab === "weight" && (
          <RequiredGrid
            options={AVATAR_WEIGHTS}
            value={draft.weight ?? "regular"}
            onChange={(v) => setDraft({ ...draft, weight: v })}
          />
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

function RequiredGrid<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
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
