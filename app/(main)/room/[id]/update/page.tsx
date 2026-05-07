"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ProgressSlider from "@/components/shared/ProgressSlider";
import NotePromptModal from "@/components/notes/NotePromptModal";
import { PROMPT_25, PROMPT_100 } from "@/lib/note-prompts";

export default function Update() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const room = useFolioStore((s) => s.rooms[id]);
  const myProgress = useFolioStore((s) => meId && room ? s.progress[`${meId}:${room.bookId}`] : null);
  const notes = useFolioStore((s) => s.notes);
  const upsertProgress = useFolioStore((s) => s.upsertProgress);
  const upsertNote = useFolioStore((s) => s.upsertNote);

  const [percent, setPercent] = useState(myProgress?.percent ?? 0);
  const [free, setFree] = useState("");
  const [show25, setShow25] = useState(false);
  const [show100, setShow100] = useState(false);

  if (!meId || !room) return null;

  const has25 = Object.values(notes).some((n) => n.userId === meId && n.bookId === room.bookId && n.type === "milestone_25");

  const saveProgress = () => {
    upsertProgress({ userId: meId, bookId: room.bookId, percent, updatedAt: Date.now() });
    if (percent >= 25 && !has25) setShow25(true);
    else if (percent >= 100) setShow100(true);
    else router.push(`/room/${room.id}`);
  };

  const saveFree = () => {
    if (!free.trim()) return;
    upsertNote({
      id: `n-${Date.now()}`, userId: meId, bookId: room.bookId,
      type: "free", content: free.trim(), createdAt: Date.now(),
    });
    setFree("");
  };

  const save25 = (entries: { prompt: string; content: string }[]) => {
    entries.forEach((e, i) => {
      upsertNote({
        id: `n-${Date.now()}-${i}`, userId: meId, bookId: room.bookId,
        type: "milestone_25", prompt: e.prompt, content: e.content, createdAt: Date.now() + i,
      });
    });
    setShow25(false);
    if (percent >= 100) setShow100(true);
    else router.push(`/room/${room.id}`);
  };

  const save100 = (entries: { prompt: string; content: string }[]) => {
    entries.forEach((e, i) => {
      upsertNote({
        id: `n-${Date.now()}-${i}`, userId: meId, bookId: room.bookId,
        type: "milestone_100", prompt: e.prompt, content: e.content, createdAt: Date.now() + i,
      });
    });
    setShow100(false);
    router.push(`/shelf/${room.bookId}/compilation`);
  };

  return (
    <PageContainer>
      <h1 className="font-display text-2xl text-walnut mb-6">更新進度與心得</h1>

      <div className="text-walnut-soft text-sm mb-2">目前進度</div>
      <ProgressSlider value={percent} onChange={setPercent} />
      <div className="mt-4"><Button onClick={saveProgress}>儲存進度</Button></div>

      <div className="mt-10">
        <div className="text-walnut-soft text-sm mb-2">隨時心得（隨手寫一張便利貼）</div>
        <Textarea value={free} onChange={(e) => setFree(e.target.value)} />
        <div className="mt-2"><Button variant="outline" onClick={saveFree} disabled={!free.trim()}>貼上牆</Button></div>
      </div>

      <NotePromptModal open={show25} onClose={() => { setShow25(false); router.push(`/room/${room.id}`); }}
        prompts={PROMPT_25} requireOne title="🎉 25% 心得（必填）" onSave={save25} />

      <NotePromptModal open={show100} onClose={() => { setShow100(false); router.push(`/shelf/${room.bookId}/compilation`); }}
        prompts={PROMPT_100} requireOne={false} title="📖 完成 100%！要寫個總結嗎？" onSave={save100} allowSkip />
    </PageContainer>
  );
}
