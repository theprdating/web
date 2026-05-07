"use client";
import Image from "next/image";
import { useState } from "react";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BookPicker from "@/components/shared/BookPicker";
import ProgressSlider from "@/components/shared/ProgressSlider";
import BookRow from "@/components/shelf/BookRow";

export default function Shelf() {
  const meId = useFolioStore((s) => s.currentUserId);
  const progress = useFolioStore((s) => s.progress);
  const upsertProgress = useFolioStore((s) => s.upsertProgress);
  const myEntries = Object.values(progress)
    .filter((p) => p.userId === meId)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const [open, setOpen] = useState(false);
  const [bookId, setBookId] = useState("");
  const [percent, setPercent] = useState(0);

  if (!meId) return null;

  const addBook = () => {
    if (!bookId) return;
    upsertProgress({ userId: meId, bookId, percent, updatedAt: Date.now() });
    setOpen(false); setBookId(""); setPercent(0);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-walnut">書櫃</h1>
        <button onClick={() => setOpen(true)} className="text-sage text-sm">＋ 加書</button>
      </div>

      {myEntries.length === 0 && (
        <div className="text-walnut-soft text-center mt-12">
          <Image
            src="/illustrations/empty-shelf.png"
            alt=""
            width={250}
            height={250}
            className="mx-auto mb-4"
          />
          還沒有書。<br/>加一本開始讀，或去探索找夥伴。
        </div>
      )}

      <div className="space-y-2">
        {myEntries.map((e) => <BookRow key={e.bookId} bookId={e.bookId} percent={e.percent} />)}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-display text-xl text-walnut">加一本書到書櫃</h3>
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-walnut-soft text-sm mb-2">選擇或輸入書名</div>
            <BookPicker value={bookId} onChange={setBookId} />
          </div>
          <div>
            <div className="text-walnut-soft text-sm mb-2">目前進度</div>
            <ProgressSlider value={percent} onChange={setPercent} />
          </div>
          <Button onClick={addBook} disabled={!bookId}>加入書櫃</Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
