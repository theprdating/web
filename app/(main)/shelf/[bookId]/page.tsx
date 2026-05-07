"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ProgressSlider from "@/components/shared/ProgressSlider";
import StickyNote from "@/components/notes/StickyNote";

export default function BookDetail() {
  const router = useRouter();
  const { bookId } = useParams<{ bookId: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const book = useFolioStore((s) => s.books[bookId]);
  const myProgress = useFolioStore((s) => meId ? s.progress[`${meId}:${bookId}`] : undefined);
  const allNotes = useFolioStore((s) => s.notes);
  const upsertProgress = useFolioStore((s) => s.upsertProgress);
  const upsertNote = useFolioStore((s) => s.upsertNote);
  const myNotes = Object.values(allNotes)
    .filter((n) => n.userId === meId && n.bookId === bookId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const [percent, setPercent] = useState(myProgress?.percent ?? 0);
  const [free, setFree] = useState("");

  if (!book || !meId) return null;

  const saveProgress = () => {
    upsertProgress({ userId: meId, bookId, percent, updatedAt: Date.now() });
  };
  const addFree = () => {
    if (!free.trim()) return;
    upsertNote({ id: `n-${Date.now()}`, userId: meId, bookId, type: "free", content: free.trim(), createdAt: Date.now() });
    setFree("");
  };

  return (
    <PageContainer>
      <button onClick={() => router.back()} className="text-sage text-sm">← 回書櫃</button>
      <h1 className="font-display text-3xl text-walnut mt-3">《{book.title}》</h1>

      <div className="mt-6">
        <div className="text-walnut-soft text-sm mb-2">進度</div>
        <ProgressSlider value={percent} onChange={setPercent} />
        <div className="mt-3"><Button onClick={saveProgress}>儲存</Button></div>
      </div>

      {percent >= 100 && (
        <div className="mt-6">
          <Link href={`/shelf/${bookId}/compilation`}>
            <Button variant="outline">查看 100% 整理頁</Button>
          </Link>
        </div>
      )}

      <div className="mt-10">
        <div className="text-walnut-soft text-sm mb-2">寫一張便利貼</div>
        <Textarea value={free} onChange={(e) => setFree(e.target.value)} />
        <div className="mt-2"><Button variant="outline" onClick={addFree} disabled={!free.trim()}>貼上牆</Button></div>
      </div>

      <h2 className="font-display text-xl text-walnut mt-8 mb-3">我的便利貼</h2>
      {myNotes.length === 0
        ? <div className="text-walnut-soft text-sm text-center py-6">還沒有便利貼。</div>
        : <div className="grid grid-cols-2 gap-3">{myNotes.map((n) => <StickyNote key={n.id} noteId={n.id} />)}</div>}
    </PageContainer>
  );
}
