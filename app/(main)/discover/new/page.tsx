"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import BookPicker from "@/components/shared/BookPicker";
import ProgressSlider from "@/components/shared/ProgressSlider";

const WEEKS = [2, 4, 6, 8, 12];

export default function NewPost() {
  const router = useRouter();
  const meId = useFolioStore((s) => s.currentUserId);
  const upsertPost = useFolioStore((s) => s.upsertPost);
  const upsertProgress = useFolioStore((s) => s.upsertProgress);

  const [bookId, setBookId] = useState("");
  const [progress, setProgress] = useState(0);
  const [whyRead, setWhyRead] = useState("");
  const [partnerExpectation, setPartner] = useState("");
  const [weeks, setWeeks] = useState(4);

  const valid = bookId && whyRead.trim() && partnerExpectation.trim();

  const submit = () => {
    if (!meId || !valid) return;
    const id = `p-${Date.now()}`;
    upsertPost({
      id, ownerId: meId, bookId, progressAtPost: progress, whyRead: whyRead.trim(),
      partnerExpectation: partnerExpectation.trim(), expectedWeeks: weeks,
      status: "open", createdAt: Date.now(),
    });
    upsertProgress({ userId: meId, bookId, percent: progress, updatedAt: Date.now() });
    router.push("/discover");
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">發一帖</h1>

      <Label>書</Label>
      <BookPicker value={bookId} onChange={setBookId} />

      <Label className="mt-6">目前進度</Label>
      <ProgressSlider value={progress} onChange={setProgress} />

      <Label className="mt-6">為什麼想讀</Label>
      <Textarea value={whyRead} onChange={(e) => setWhyRead(e.target.value)} />

      <Label className="mt-6">期待對方</Label>
      <Textarea value={partnerExpectation} onChange={(e) => setPartner(e.target.value)} />

      <Label className="mt-6">預期週數</Label>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {WEEKS.map((w) => (
          <button key={w} onClick={() => setWeeks(w)}
            className={`py-2 rounded-xl border text-sm ${weeks === w ? "border-sage bg-sage text-cream" : "border-tag/40"}`}>{w}</button>
        ))}
      </div>

      <div className="mt-10">
        <Button onClick={submit} disabled={!valid}>發布</Button>
      </div>
    </PageContainer>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-walnut-soft text-sm mb-2 ${className}`}>{children}</div>;
}
