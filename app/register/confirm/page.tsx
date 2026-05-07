"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ConfirmPage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const finalize = () => {
    setOpen(false);
    router.push("/discover");
  };

  return (
    <>
      <RegisterStepper current={3} />
      <h1 className="font-display text-3xl text-walnut mb-6">確認你的資料</h1>

      <dl className="space-y-3 text-walnut">
        <Row k="暱稱"   v={user.nickname} />
        <Row k="性別"   v={user.gender} />
        <Row k="年齡"   v={String(user.age)} />
        <Row k="書籍種類" v={user.bookCategories.join("、")} />
        <Row k="心態"   v={user.stance} />
      </dl>

      <div className="mt-10">
        <Button onClick={() => setOpen(true)}>確認送出</Button>
      </div>

      <Modal open={open}>
        <h3 className="font-display text-xl text-walnut">⚠️ 確認無誤嗎？</h3>
        <p className="text-walnut-soft text-sm mt-3 leading-relaxed">
          以下資料註冊後將無法直接更改：<br/>
          <span className="text-walnut font-medium">性別、年齡</span><br/>
          如需更改、需提交審核（之後在「我的頁面」操作）。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>回上一步</Button>
          <Button onClick={finalize}>確認送出</Button>
        </div>
      </Modal>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-tag/30 pb-2">
      <dt className="text-walnut-soft">{k}</dt>
      <dd>{v || "—"}</dd>
    </div>
  );
}
