"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import { canUnlockChat } from "@/lib/unlock";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import ProgressCard from "@/components/room/ProgressCard";
import StickyNoteWall from "@/components/room/StickyNoteWall";
import Celebration from "@/components/room/Celebration";

export default function Room() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const room = useFolioStore((s) => s.rooms[id]);
  const users = useFolioStore((s) => s.users);
  const books = useFolioStore((s) => s.books);
  const progress = useFolioStore((s) => s.progress);
  const notes = useFolioStore((s) => s.notes);
  const upsertRoom = useFolioStore((s) => s.upsertRoom);

  const [celebrating, setCelebrating] = useState(false);

  if (!room || !meId) return null;
  const otherId = room.userAId === meId ? room.userBId : room.userAId;
  const me = users[meId], other = users[otherId];
  const myP = progress[`${meId}:${room.bookId}`]?.percent ?? 0;
  const oP  = progress[`${otherId}:${room.bookId}`]?.percent ?? 0;

  const has25 = (uid: string) =>
    Object.values(notes).some((n) => n.bookId === room.bookId && n.userId === uid && n.type === "milestone_25");

  const canUnlock = canUnlockChat({ a: myP, b: oP }, { a: has25(meId), b: has25(otherId) });

  useEffect(() => {
    if (canUnlock && !room.chatUnlockedAt) {
      upsertRoom({ ...room, chatUnlockedAt: Date.now() });
    }
  }, [canUnlock, room, upsertRoom]);

  useEffect(() => {
    const bothDone = myP >= 100 && oP >= 100;
    if (bothDone && !room.celebratedAt) {
      setCelebrating(true);
      upsertRoom({ ...room, celebratedAt: Date.now() });
    }
  }, [myP, oP, room, upsertRoom]);

  if (!me || !other) return null;

  return (
    <PageContainer>
      <h1 className="font-display text-2xl text-walnut">與 {other.nickname} 共讀</h1>
      <p className="text-walnut-soft text-sm mt-1">《{books[room.bookId]?.title}》</p>

      <div className="mt-4">
        <ProgressCard a={{ name: me.nickname, percent: myP }} b={{ name: other.nickname, percent: oP }} />
      </div>

      <div className="mt-6">
        <Button onClick={() => router.push(`/room/${room.id}/update`)}>更新進度 / 寫便利貼</Button>
      </div>

      <h2 className="font-display text-xl text-walnut mt-8 mb-3">便利貼牆</h2>
      <StickyNoteWall bookId={room.bookId} userIds={[meId, otherId]} />

      <h2 className="font-display text-xl text-walnut mt-8 mb-3">聊天</h2>
      {room.chatUnlockedAt ? (
        <div onClick={() => router.push(`/room/${room.id}/chat`)} className="p-4 bg-cream rounded-xl border border-tag/30 cursor-pointer">
          進入聊天 →
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-tag/10 border-2 border-dashed border-tag/40 text-center">
          <div className="text-walnut-soft text-sm">聊天上鎖中</div>
          <div className="text-walnut text-sm mt-2 leading-relaxed">
            雙方都需要：<br/>
            ✓ 進度 ≥ 25%<br/>
            ✓ 寫完 25% 心得
          </div>
        </div>
      )}

      {celebrating && <Celebration roomId={room.id} onClose={() => setCelebrating(false)} />}
    </PageContainer>
  );
}
