"use client";
import { useFolioStore } from "@/lib/store";
import { isSameDay, formatLocalTime, formatDayLabel } from "@/lib/format-time";
import clsx from "clsx";

export default function ChatLog({ roomId, meId }: { roomId: string; meId: string }) {
  const messages = useFolioStore((s) =>
    Object.values(s.messages).filter((m) => m.roomId === roomId).sort((a, b) => a.createdAt - b.createdAt)
  );
  if (messages.length === 0) {
    return <div className="text-walnut-soft text-center py-8">還沒對話。打第一句吧。</div>;
  }
  const blocks: Array<{ kind: "day"; ts: number } | { kind: "msg"; m: typeof messages[number] }> = [];
  messages.forEach((m, i) => {
    if (i === 0 || !isSameDay(m.createdAt, messages[i-1].createdAt)) {
      blocks.push({ kind: "day", ts: m.createdAt });
    }
    blocks.push({ kind: "msg", m });
  });
  return (
    <div className="space-y-2">
      {blocks.map((b, i) =>
        b.kind === "day" ? (
          <div key={i} className="text-center text-walnut-soft text-xs py-2">{formatDayLabel(b.ts)}</div>
        ) : (
          <div key={i} className={clsx("flex", b.m.senderId === meId ? "justify-end" : "justify-start")}>
            <div className={clsx("max-w-[75%] rounded-2xl px-4 py-2",
              b.m.senderId === meId ? "bg-sage text-cream" : "bg-cream border border-tag/30 text-walnut")}>
              <div className="whitespace-pre-line">{b.m.content}</div>
              <div className={clsx("text-[10px] mt-1", b.m.senderId === meId ? "text-cream/70" : "text-walnut-soft")}>
                {formatLocalTime(b.m.createdAt)}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
