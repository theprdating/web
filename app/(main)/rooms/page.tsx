"use client";
import Link from "next/link";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import clsx from "clsx";

export default function RoomsList() {
  const meId = useFolioStore((s) => s.currentUserId);
  const rooms = useFolioStore((s) => s.rooms);
  const users = useFolioStore((s) => s.users);
  const books = useFolioStore((s) => s.books);
  const progress = useFolioStore((s) => s.progress);

  if (!meId) return null;

  const myRooms = Object.values(rooms)
    .filter((r) => r.userAId === meId || r.userBId === meId)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">共讀</h1>

      {myRooms.length === 0 && (
        <div className="text-walnut-soft text-center mt-16">
          還沒有共讀。<br/>去探索找夥伴吧。
        </div>
      )}

      <div className="space-y-3">
        {myRooms.map((r) => {
          const otherId = r.userAId === meId ? r.userBId : r.userAId;
          const partner = users[otherId];
          const book = books[r.bookId];
          const myP = progress[`${meId}:${r.bookId}`]?.percent ?? 0;
          const oP = progress[`${otherId}:${r.bookId}`]?.percent ?? 0;

          let statusLabel = "";
          let statusTone = "";
          if (r.celebratedAt) {
            statusLabel = "已完成";
            statusTone = "bg-sage/20 text-sage";
          } else if (r.chatUnlockedAt) {
            if (myP >= 100 || oP >= 100) {
              statusLabel = "進入尾聲";
              statusTone = "bg-amber-200/40 text-amber-800";
            } else {
              statusLabel = "聊天中";
              statusTone = "bg-sage/20 text-sage";
            }
          } else {
            statusLabel = "聊天上鎖";
            statusTone = "bg-tag/30 text-walnut-soft";
          }

          return (
            <Link key={r.id} href={`/room/${r.id}`}
              className="block p-5 rounded-2xl bg-cream border border-tag/30 hover:border-sage transition-colors">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-display text-xl text-walnut">《{book?.title ?? "—"}》</div>
                  <div className="text-walnut-soft text-sm mt-1">與 {partner?.nickname ?? "—"}</div>
                </div>
                <span className={clsx("text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap", statusTone)}>
                  {statusLabel}
                </span>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-walnut-soft">
                <span>你 {myP}%</span>
                <span>{partner?.nickname} {oP}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
