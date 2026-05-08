"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import AvatarEditorBody from "@/components/me/AvatarEditorBody";
import Button from "@/components/ui/Button";
import type { Avatar } from "@/lib/store";

export default function AvatarStep() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [draft, setDraft] = useState<Avatar>(user?.avatar ?? { base: "sage" });

  if (!user) return null;

  const next = () => {
    upsertUser({ ...user, avatar: draft });
    router.push("/register/confirm");
  };

  return (
    <>
      <RegisterStepper current={3} />
      <h1 className="font-display text-3xl text-walnut mb-2">打扮你的角色</h1>
      <p className="text-walnut-soft text-sm mb-6">這個小人會代表你出現在貼文與共讀室。之後在「我」頁面隨時可改。</p>

      <AvatarEditorBody value={draft} onChange={setDraft} />

      <div className="grid grid-cols-2 gap-3 mt-8">
        <Button variant="outline" onClick={() => router.push("/register/stance")}>上一步</Button>
        <Button onClick={next}>下一步</Button>
      </div>
    </>
  );
}
