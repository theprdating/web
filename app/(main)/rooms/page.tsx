"use client";
import Link from "next/link";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import StatCard from "@/components/shared/StatCard";
import SectionHeader from "@/components/shared/SectionHeader";
import AvatarTiny from "@/components/me/AvatarTiny";
import clsx from "clsx";

export default function RoomsList() {
  const meId = useFolioStore((s) => s.currentUserId);
  const rooms = useFolioStore((s) => s.rooms);
  const users = useFolioStore((s) => s.users);
  const books = useFolioStore((s) => s.books);
  const progress = useFolioStore((s) => s.progress);
  const messages = useFolioStore((s) => s.messages);

  if (!meId) return null;

  const myRooms = Object.values(rooms)
    .filter((r) => r.userAId === meId || r.userBId === meId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const ongoing = myRooms.filter((r) => r.chatUnlockedAt && !r.celebratedAt);
  const waiting = myRooms.filter((r) => !r.chatUnlockedAt);
  const finished = myRooms.filter((r) => !!r.celebratedAt);

  const renderCard = (r: typeof myRooms[number]) => {
    const otherId = r.userAId === meId ? r.userBId : r.userAId;
    const partner = users[otherId];
    const book = books[r.bookId];
    const myP = progress[`${meId}:${r.bookId}`]?.percent ?? 0;
    const oP = progress[`${otherId}:${r.bookId}`]?.percent ?? 0;

    // last message in room
    const lastMsg = Object.values(messages)
      .filter((m) => m.roomId === r.id)
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    let badge = "";
    let badgeTone = "";
    if (r.celebratedAt) { badge = "已完成"; badgeTone = "bg-sage/20 text-sage"; }
    else if (r.chatUnlockedAt) {
      if (myP >= 100 || oP >= 100) { badge = "進入尾聲"; badgeTone = "bg-amber-200/40 text-amber-800"; }
      else { badge = "聊天中"; badgeTone = "bg-sage/20 text-sage"; }
    } else { badge = "聊天上鎖"; badgeTone = "bg-tag/30 text-walnut-soft"; }

    return (
      <Link key={r.id} href={`/room/${r.id}`}
        className="block p-5 rounded-2xl bg-cream border border-tag/30 hover:border-sage transition-colors">
        <div className="flex items-start gap-3">
          <AvatarTiny avatar={partner?.avatar} size={44} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="font-display text-lg text-walnut truncate">《{book?.title ?? "—"}》</div>
              <span className={clsx("text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap", badgeTone)}>{badge}</span>
            </div>
            <div className="text-walnut-soft text-sm mt-0.5">與 {partner?.nickname ?? "—"}</div>

            <div className="flex gap-3 mt-2 text-xs text-walnut-soft">
              <span>你 {myP}%</span>
              <span>{partner?.nickname} {oP}%</span>
            </div>

            {lastMsg ? (
              <p className="text-walnut text-xs mt-2 line-clamp-1">
                {lastMsg.senderId === meId ? "你：" : `${partner?.nickname}：`}{lastMsg.content}
              </p>
            ) : !r.chatUnlockedAt ? (
              <p className="text-walnut-soft text-xs mt-2 italic">
                再讀 {Math.max(0, 25 - myP)}% + 寫 25% 心得，解鎖聊天
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">共讀</h1>

      <StatCard stats={[
        { number: ongoing.length, label: "進行中" },
        { number: waiting.length, label: "等待中" },
        { number: finished.length, label: "已完成" },
      ]} />

      {myRooms.length === 0 && (
        <div className="text-walnut-soft text-center mt-16">
          還沒有共讀。<br/>去探索找夥伴吧。
        </div>
      )}

      {ongoing.length > 0 && (
        <>
          <SectionHeader label="進行中" count={ongoing.length} />
          <div className="space-y-3">{ongoing.map(renderCard)}</div>
        </>
      )}
      {waiting.length > 0 && (
        <>
          <SectionHeader label="等待解鎖" count={waiting.length} />
          <div className="space-y-3">{waiting.map(renderCard)}</div>
        </>
      )}
      {finished.length > 0 && (
        <>
          <SectionHeader label="已完成" count={finished.length} />
          <div className="space-y-3">{finished.map(renderCard)}</div>
        </>
      )}
    </PageContainer>
  );
}
