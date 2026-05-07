"use client";
import { useState } from "react";
import { useFolioStore } from "@/lib/store";
import { cooldownRemainingMs, formatRemainingDays } from "@/lib/cooldown";
import { STANCE_META } from "@/lib/stance-meta";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import EditFieldModal from "@/components/me/EditFieldModal";
import Modal from "@/components/ui/Modal";
import type { Stance } from "@/lib/store";
import clsx from "clsx";

export default function MePage() {
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [editing, setEditing] = useState<null | "nickname" | "categories" | "qa">(null);
  const [stanceModal, setStanceModal] = useState(false);

  if (!user) return null;

  const nickCooldownLeft = cooldownRemainingMs(user.nicknameChangedAt, 30);
  const stanceCooldownLeft = cooldownRemainingMs(user.stanceChangedAt, 7);

  const setStance = (next: Stance) => {
    if (next === user.stance) { setStanceModal(false); return; }
    upsertUser({ ...user, stance: next, stanceChangedAt: Date.now() });
    setStanceModal(false);
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">我</h1>

      <Section label="暱稱" value={user.nickname}
        rightAction={<button onClick={() => setEditing("nickname")} disabled={nickCooldownLeft > 0}
          className={clsx("text-sm", nickCooldownLeft > 0 ? "text-walnut-soft" : "text-sage")}>
          {nickCooldownLeft > 0 ? formatRemainingDays(nickCooldownLeft) : "編輯"}
        </button>} />

      <Section label="性別 / 年齡" value={`${user.gender} ・ ${user.age}`}
        rightAction={<button className="text-sm text-walnut-soft underline">需審核才能改</button>} />

      <Section label="書籍種類" value={user.bookCategories.join("、")}
        rightAction={<button onClick={() => setEditing("categories")} className="text-sm text-sage">編輯</button>} />

      <Section label="個性問答" value={
        [user.qaAnswers.defining, user.qaAnswers.titleOfMyLife, user.qaAnswers.readingHours]
          .filter(Boolean).join(" / ") || "尚未填寫"
      } rightAction={<button onClick={() => setEditing("qa")} className="text-sm text-sage">編輯</button>} />

      <Section label="抱持的心態" value={user.stance}
        rightAction={<button onClick={() => setStanceModal(true)} disabled={stanceCooldownLeft > 0}
          className={clsx("text-sm", stanceCooldownLeft > 0 ? "text-walnut-soft" : "text-sage")}>
          {stanceCooldownLeft > 0 ? formatRemainingDays(stanceCooldownLeft) : "更換"}
        </button>} />

      <EditFieldModal open={editing === "nickname"} onClose={() => setEditing(null)}
        label="暱稱" initial={user.nickname}
        cooldownMessage="更換後將進入 30 天冷卻"
        onSave={(v) => upsertUser({ ...user, nickname: v.trim() || user.nickname, nicknameChangedAt: Date.now() })} />

      {/* Categories / QA edit modals 留 placeholder，下個 task 補完 */}

      <Modal open={stanceModal} onClose={() => setStanceModal(false)}>
        <h3 className="font-display text-xl text-walnut">更換心態</h3>
        <p className="text-amber-700 text-sm mt-2">⚠️ 更換後將進入 7 天冷卻、期間無法再次變更。</p>
        <div className="space-y-2 mt-4">
          {(Object.keys(STANCE_META) as Stance[]).map((s) => (
            <button key={s} onClick={() => setStance(s)} className={clsx(
              "w-full p-3 rounded-xl border text-left",
              user.stance === s ? "border-sage bg-sage/10" : "border-tag/30")}>
              <div className="font-medium">{STANCE_META[s].label}</div>
              <div className="text-walnut-soft text-sm">{STANCE_META[s].sub}</div>
            </button>
          ))}
        </div>
      </Modal>
    </PageContainer>
  );
}

function Section({ label, value, rightAction }: { label: string; value: string; rightAction: React.ReactNode }) {
  return (
    <div className="border-b border-tag/30 py-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-walnut-soft text-xs">{label}</div>
          <div className="text-walnut mt-1">{value}</div>
        </div>
        <div>{rightAction}</div>
      </div>
    </div>
  );
}
