"use client";
import Link from "next/link";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import clsx from "clsx";

export default function MyPosts() {
  const meId = useFolioStore((s) => s.currentUserId);
  const posts = useFolioStore((s) => s.posts);
  const applications = useFolioStore((s) => s.applications);
  const books = useFolioStore((s) => s.books);

  if (!meId) return null;

  const myPosts = Object.values(posts)
    .filter((p) => p.ownerId === meId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const open = myPosts.filter((p) => p.status === "open");
  const closed = myPosts.filter((p) => p.status === "closed");

  const renderCard = (p: typeof myPosts[number]) => {
    const book = books[p.bookId];
    const apps = Object.values(applications).filter((a) => a.postId === p.id);
    const pending = apps.filter((a) => a.status === "pending").length;
    const accepted = apps.filter((a) => a.status === "accepted").length;
    const rejected = apps.filter((a) => a.status === "rejected").length;

    return (
      <Link
        key={p.id}
        href={`/discover/post/${p.id}/applicants`}
        className="block p-5 rounded-2xl bg-cream border border-tag/30 hover:border-sage transition-colors"
      >
        <div className="flex justify-between items-start gap-2">
          <div className="font-display text-lg text-walnut truncate">《{book?.title ?? "—"}》</div>
          <span
            className={clsx(
              "text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap",
              p.status === "open" ? "bg-sage/20 text-sage" : "bg-tag/30 text-walnut-soft"
            )}
          >
            {p.status === "open" ? "開放中" : "已關閉"}
          </span>
        </div>
        <p className="text-walnut text-sm mt-2 line-clamp-2">{p.whyRead}</p>
        <div className="flex gap-3 mt-3 text-xs flex-wrap">
          {pending > 0 && <span className="text-sage font-medium">{pending} 人待回覆</span>}
          {accepted > 0 && <span className="text-walnut-soft">{accepted} 已接受</span>}
          {rejected > 0 && <span className="text-walnut-soft">{rejected} 已拒絕</span>}
          {apps.length === 0 && <span className="text-walnut-soft italic">還沒人申請</span>}
        </div>
      </Link>
    );
  };

  return (
    <PageContainer>
      <Link href="/discover" className="text-sage text-sm">← 回探索</Link>
      <h1 className="font-display text-3xl text-walnut mt-3 mb-6">我的貼文</h1>

      {myPosts.length === 0 && (
        <div className="text-walnut-soft text-center mt-16">
          還沒發過貼文。<br />
          到探索頁試試看吧。
        </div>
      )}

      {open.length > 0 && (
        <>
          <SectionHeader label="開放中" count={open.length} />
          <div className="space-y-3">{open.map(renderCard)}</div>
        </>
      )}

      {closed.length > 0 && (
        <>
          <SectionHeader label="已關閉" count={closed.length} />
          <div className="space-y-3">{closed.map(renderCard)}</div>
        </>
      )}
    </PageContainer>
  );
}
