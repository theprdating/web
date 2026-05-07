"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useFolioStore } from "@/lib/store";
import { canSeeEachOther } from "@/lib/filters";
import PageContainer from "@/components/ui/PageContainer";
import PostCard from "@/components/feed/PostCard";
import Tutorial from "@/components/onboarding/Tutorial";

export default function Discover() {
  const userId = useFolioStore((s) => s.currentUserId);
  const me     = useFolioStore((s) => userId ? s.users[userId] : null);
  const posts  = useFolioStore((s) => s.posts);
  const users  = useFolioStore((s) => s.users);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (me && !me.tutorialSeenAt) setShowTutorial(true);
  }, [me]);

  const dismissTutorial = () => {
    if (!me) return;
    upsertUser({ ...me, tutorialSeenAt: Date.now() });
    setShowTutorial(false);
  };

  if (!me) return null;

  const visible = Object.values(posts)
    .filter((p) => p.status === "open" && p.ownerId !== me.id)
    .filter((p) => {
      const owner = users[p.ownerId];
      return owner && canSeeEachOther(me.stance, owner.stance);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-walnut">探索</h1>
        <Link href="/discover/new" className="flex items-center gap-1 text-sage">
          <Plus size={18} /> 發帖
        </Link>
      </div>

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

      {showTutorial && <Tutorial onClose={dismissTutorial} />}
    </PageContainer>
  );
}
