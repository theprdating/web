"use client";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import StickyNote from "@/components/notes/StickyNote";

export default function Compilation() {
  const router = useRouter();
  const { bookId } = useParams<{ bookId: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const book = useFolioStore((s) => s.books[bookId]);
  const me   = useFolioStore((s) => meId ? s.users[meId] : null);
  const myNotes = useFolioStore((s) =>
    Object.values(s.notes).filter((n) => n.userId === meId && n.bookId === bookId)
      .sort((a, b) => a.createdAt - b.createdAt)
  );

  if (!book || !me) return null;

  const share = async () => {
    const text = `📖《${book.title}》— ${me.nickname} 的閱讀整理 #Folio`;
    if ((navigator as { share?: (data: { title: string; text: string; url: string }) => Promise<void> }).share) {
      try { await navigator.share!({ title: "Folio", text, url: location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${location.href}`);
      alert("已複製分享連結");
    }
  };

  return (
    <PageContainer>
      <button onClick={() => router.back()} className="text-sage text-sm">← 回</button>
      <div className="text-center mt-6">
        <div className="font-display text-walnut text-sm">— {me.nickname} 與 —</div>
        <h1 className="font-display text-4xl text-walnut mt-2">《{book.title}》</h1>
        <div className="text-walnut-soft text-sm mt-2">的閱讀整理</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        {myNotes.length === 0
          ? <div className="col-span-2 text-walnut-soft text-center py-8">這本書還沒有便利貼</div>
          : myNotes.map((n) => <StickyNote key={n.id} noteId={n.id} />)}
      </div>

      <div className="mt-12 space-y-3">
        <Button onClick={share}>分享到社交媒體</Button>
        <div className="text-walnut-soft text-xs text-center">— Folio —</div>
      </div>
    </PageContainer>
  );
}
