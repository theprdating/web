"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ChatLog from "@/components/room/ChatLog";

export default function Chat() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const room = useFolioStore((s) => s.rooms[id]);
  const otherName = useFolioStore((s) => {
    if (!room || !meId) return "";
    const otherId = room.userAId === meId ? room.userBId : room.userAId;
    return s.users[otherId]?.nickname ?? "";
  });
  const append = useFolioStore((s) => s.appendMessage);

  const [text, setText] = useState("");

  useEffect(() => {
    if (room && !room.chatUnlockedAt) router.replace(`/room/${room.id}`);
  }, [room, router]);

  if (!meId || !room || !room.chatUnlockedAt) return null;

  const send = () => {
    if (!text.trim()) return;
    append({ id: `m-${Date.now()}`, roomId: room.id, senderId: meId, content: text.trim(), createdAt: Date.now() });
    setText("");
  };

  return (
    <PageContainer className="flex flex-col h-screen pb-32">
      <button onClick={() => router.push(`/room/${room.id}`)} className="text-sage text-sm">← 回共讀室</button>
      <h1 className="font-display text-2xl text-walnut mt-3">與 {otherName}</h1>

      <div className="flex-1 overflow-y-auto mt-4 -mx-2 px-2"><ChatLog roomId={room.id} meId={meId} /></div>

      <div className="fixed inset-x-0 bottom-16 max-w-[480px] mx-auto px-6 py-3 bg-parchment border-t border-tag/30 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="說點什麼…"
          onKeyDown={(e) => e.key === "Enter" && send()} />
        <Button onClick={send} className="w-auto px-6">送出</Button>
      </div>
    </PageContainer>
  );
}
