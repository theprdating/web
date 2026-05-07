"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ProgressSlider from "@/components/shared/ProgressSlider";
import { signApplication } from "@/lib/signature";

export default function ApplyPage() {
  const router = useRouter();
  const { postId } = useParams<{ postId: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const post  = useFolioStore((s) => s.posts[postId]);
  const owner = useFolioStore((s) => post && s.users[post.ownerId]);
  const book  = useFolioStore((s) => post && s.books[post.bookId]);
  const myProgress = useFolioStore((s) => meId && post ? s.progress[`${meId}:${post.bookId}`] : null);
  const upsertApplication = useFolioStore((s) => s.upsertApplication);
  const upsertProgress    = useFolioStore((s) => s.upsertProgress);

  const [progress, setProgress] = useState(myProgress?.percent ?? 0);
  const [whyRead, setWhyRead] = useState("");
  const [selfOffer, setSelfOffer] = useState("");
  const [weeks, setWeeks] = useState(post?.expectedWeeks ?? 4);

  if (!post || !owner || !book || !meId) return null;

  const valid = whyRead.trim() && selfOffer.trim();

  const submit = () => {
    const id = `a-${Date.now()}`;
    upsertApplication({
      id, postId: post.id, applicantId: meId,
      progressAtApply: progress,
      whyRead: signApplication(owner.nickname, whyRead),
      selfOffer: selfOffer.trim(),
      expectedWeeks: weeks,
      status: "pending",
      createdAt: Date.now(),
    });
    upsertProgress({ userId: meId, bookId: post.bookId, percent: progress, updatedAt: Date.now() });
    router.push("/discover");
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut">申請《{book.title}》共讀</h1>
      <p className="text-walnut-soft text-sm mt-1">寫給 {owner.nickname} 看</p>

      <Label className="mt-6">我目前進度</Label>
      <ProgressSlider value={progress} onChange={setProgress} />

      <Label className="mt-6">為什麼想加入這本書的共讀</Label>
      <Textarea value={whyRead} onChange={(e) => setWhyRead(e.target.value)} />
      <p className="text-walnut-soft text-xs mt-1">送出時會自動署名 Dear {owner.nickname}</p>

      <Label className="mt-6">我能成為怎樣的讀書夥伴</Label>
      <Textarea value={selfOffer} onChange={(e) => setSelfOffer(e.target.value)} />

      <Label className="mt-6">預期讀完週數</Label>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {[2, 4, 6, 8, 12].map((w) => (
          <button key={w} onClick={() => setWeeks(w)}
            className={`py-2 rounded-xl border text-sm ${weeks === w ? "border-sage bg-sage text-cream" : "border-tag/40"}`}>{w}</button>
        ))}
      </div>

      <div className="mt-10">
        <Button onClick={submit} disabled={!valid}>送出申請</Button>
      </div>
    </PageContainer>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-walnut-soft text-sm mb-2 ${className}`}>{children}</div>;
}
