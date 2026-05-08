"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import type { Avatar as AvatarType, AvatarBase, AvatarBg, AvatarExpression, AvatarHeight, AvatarWeight } from "@/lib/store";
import {
  AVATAR_BASES, AVATAR_BGS, AVATAR_EXPRESSIONS, AVATAR_HEIGHTS, AVATAR_WEIGHTS,
} from "@/lib/avatar-data";
import clsx from "clsx";

type Tab = "base" | "bg" | "expression" | "height" | "weight";
const TABS: { id: Tab; label: string }[] = [
  { id: "base", label: "顏色" },
  { id: "bg", label: "背景" },
  { id: "expression", label: "表情" },
  { id: "height", label: "身高" },
  { id: "weight", label: "胖瘦" },
];

export default function AvatarEditorBody({
  value, onChange, previewSize = 200,
}: {
  value: AvatarType; onChange: (next: AvatarType) => void; previewSize?: number;
}) {
  const [tab, setTab] = useState<Tab>("base");

  return (
    <div>
      <div className="bg-parchment rounded-2xl py-4">
        <Avatar avatar={value} size={previewSize} />
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

      <div className="mt-4 max-h-[220px] overflow-y-auto">
        {tab === "base" && (
          <RequiredGrid<AvatarBase> options={AVATAR_BASES} value={value.base}
            onChange={(b) => onChange({ ...value, base: b })} />
        )}
        {tab === "bg" && (
          <ClearableGrid<AvatarBg> options={AVATAR_BGS} value={value.bg}
            onChange={(b) => onChange({ ...value, bg: b })} />
        )}
        {tab === "expression" && (
          <RequiredGrid<AvatarExpression>
            options={AVATAR_EXPRESSIONS} value={value.expression ?? "default"}
            onChange={(e) => onChange({ ...value, expression: e })} />
        )}
        {tab === "height" && (
          <RequiredGrid<AvatarHeight>
            options={AVATAR_HEIGHTS} value={value.height ?? "regular"}
            onChange={(h) => onChange({ ...value, height: h })} />
        )}
        {tab === "weight" && (
          <RequiredGrid<AvatarWeight>
            options={AVATAR_WEIGHTS} value={value.weight ?? "regular"}
            onChange={(w) => onChange({ ...value, weight: w })} />
        )}
      </div>
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

function ClearableGrid<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[]; value?: T; onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button onClick={() => onChange(undefined)}
        className={clsx("p-3 rounded-xl border text-sm",
          !value ? "border-sage bg-sage/10" : "border-tag/30")}>
        無
      </button>
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
