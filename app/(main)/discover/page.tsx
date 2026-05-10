"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useFolioStore } from "@/lib/store";
import { canSeeEachOther } from "@/lib/filters";
import PageContainer from "@/components/ui/PageContainer";
import PostCard from "@/components/feed/PostCard";
import StatCard from "@/components/shared/StatCard";

export default function Discover() {
  const userId = useFolioStore((s) => s.currentUserId);
  const me     = useFolioStore((s) => userId ? s.users[userId] : null);
  const posts  = useFolioStore((s) => s.posts);
  const users  = useFolioStore((s) => s.users);
  const tourStep = useFolioStore((s) => s.tourStep);
  const setTourStep = useFolioStore((s) => s.setTourStep);

  // Start the page-tour for first-time users
  useEffect(() => {
    if (me && !me.tutorialSeenAt && tourStep === null) {
      setTourStep(0);
    }
  }, [me, tourStep, setTourStep]);

  if (!me) return null;

  const visible = Object.values(posts)
    .filter((p) => p.status === "open" && p.ownerId !== me.id)
    .filter((p) => {
      const owner = users[p.ownerId];
      return owner && canSeeEachOther(me.stance, owner.stance);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalOpen = Object.values(posts).filter((p) => p.status === "open" && p.ownerId !== me.id).length;
  const matchYou = visible.length;
  const openMinded = Object.values(users).filter((u) => u.id !== me.id && u.stance === "不拘").length;

  return (
    <PageContainer>
      <div
        aria-hidden
        className="w-full aspect-[3/1] mb-4 bg-no-repeat bg-cover bg-center rounded-2xl shadow-sm"
        style={{ backgroundImage: "url(/illustrations/decorations/hero-discover.png)" }}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-walnut">探索</h1>
        <Link href="/discover/new" className="flex items-center gap-1 text-sage">
          <Plus size={18} /> 發帖
        </Link>
      </div>

      <StatCard stats={[
        { number: totalOpen, label: "公開貼文" },
        { number: matchYou, label: "適合你" },
        { number: openMinded, label: "不拘的人" },
      ]} />

      {visible.length === 0 && (
        <div className="text-walnut-soft text-center mt-16">
          <Image
            src="/illustrations/empty-discover.png"
            alt=""
            width={400}
            height={300}
            className="w-3/4 max-w-[300px] mx-auto mb-4"
          />
          目前沒有符合的貼文。<br/>試試發一篇？
        </div>
      )}

      <div className="space-y-3">
        {visible.map((p) => <PostCard key={p.id} postId={p.id} />)}
      </div>
    </PageContainer>
  );
}
